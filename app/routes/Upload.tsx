import React, { type FormEvent } from 'react'
import { useState } from 'react';
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from 'lib/pdf2img';
import { useAuth } from '~/context/AuthContext';
import { useEffect } from 'react';

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const {isLoggedIn , loading} = useAuth();


    useEffect(() => {
        if(loading) return;
        if (isLoggedIn === false) {
        navigate(`/auth?next=/`);
        }
    }, [loading, isLoggedIn, navigate]);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setIsProcessing(true);

        setStatusText("Uploading the Resume ...");
        const imageFile = await convertPdfToImage(file);
        const userId = localStorage.getItem("userId");

        await delay(2000);       
        setStatusText("Converting to Text ...");
        const formData = new FormData();
        formData.append("id", userId ?? "");
        formData.append("file", file);

        await delay(2000);
        setStatusText("Preparing data...");

        if (imageFile.file) {
            formData.append("image", imageFile.file, imageFile.file.name);
        } else {
            console.warn("PDF to image conversion failed, not appending image");
        }

        formData.append("jobTitle", jobTitle);
        formData.append("company", companyName);
        formData.append("jobDescription", jobDescription);
        
        const token = localStorage.getItem("token");
        console.log(token);

        setStatusText("Analyzing ...")
        const response = await fetch("http://localhost:8081/api/resume/analyze", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        setStatusText("Analysis complete, Redirecting ...");

        if (!response.ok) {
            throw new Error("AI Analyzing Failed");
        }
        console.log(response);
        const data = await response.json();
        navigate(`/resume/${1}`,{state: {data}})
        console.log(data);
    }    

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string ;
        const jobTitle = formData.get('job-title') as string ;
        const jobDescription = formData.get('job-description') as string ;

        console.log({companyName, jobTitle, jobDescription, file})

        if(!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file});
    }


    return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover " >
        <Navbar />
        <section className='main-section' >
            <div className="page-heading py-16 ">
                <h1>Smart feedback for your dream job</h1>
                {isProcessing ? (
                    <>
                        <h2>{statusText}</h2>
                        <img src='/images/resume-scan.gif' className='w-full'  />
                    </>
                ) : (
                    <h2>Drop your resume for an ATS score and improvement tips</h2>
                )}
                {!isProcessing && (
                    <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4' >
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input type='text'name='company-name' placeholder='Company Name' id='company-name' />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title">Job Title</label>
                            <input type='text'name='job-title' placeholder='Job Title' id='job-title' />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description' />
                        </div>
                        <div className="form-div">
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader  onFileSelect={handleFileSelect}  />
                        </div>

                        <button className='primary-button' type='submit' > 
                            Analyze Resume 
                        </button>
                    </form>
                )}
            </div>
        </section>
    </main>
  )
}

export default Upload;