import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'

export interface ResponseType{
  id: number;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  feedback?: string | null;
  resumePdf: string;
  image: string;
}

const ResumeCard = ( {resume} : {resume: ResponseType} ) => {
    const {id, jobTitle, companyName, feedback, image, resumePdf} = resume;

    const [imageData, setImageData] = useState<string | null>(null);

    const fetchImage = async (imageBytes: string, mimeType: string) => {
        const byteChars = atob(imageBytes);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        console.log(blob)
        const imageUrl = URL.createObjectURL(blob);
        setImageData(imageUrl);
        console.log(imageUrl);
    };

    useEffect(() => {
        fetchImage(image, "image/png");
    },[])

  return (
    <Link to={`/resume/${id}`} state={resume}  className='resume-card animate-in fade-in duration-1000'  >
        <div className="resume-card-header">
            <div className="flex flex-col gap-2 ">
                <h2 className="!text-black font-bold break-words ">
                    {companyName}
                </h2>
                <h3 className='text-lg break-words text-gray' >
                    {jobTitle}
                </h3>
            </div>
            <div className="flex-shrink-0">
                <ScoreCircle score={ JSON.parse(feedback || "").overallScore} />
            </div>
        </div>
        <div className="gradient-border animate-in fade-in duration-1000">
            <div className="w-full h-full ">
                {imageData ? (
                    <img src={imageData}
                        alt='resume'
                        className='w-full h-[350px] max-sm:h-[200px] object-cover object-top'
                    />
                ):(
                    <div className="w-full h-[350px] flex items-center justify-center text-gray-400">
                        Loading...
                    </div>
                )}
                
            </div>
        </div>
    </Link>
  )
}

export default ResumeCard