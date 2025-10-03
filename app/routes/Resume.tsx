import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router'
import { useAuth } from "~/context/AuthContext";
import Summary from '~/components/Summary';
import Details from '~/components/Details';
import ATS from '~/components/ATS';
import type { ResponseType } from '~/components/ResumeCard';

const Resume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { loading, isLoggedIn } = useAuth();

  const [resume, setResume] = useState<ResponseType | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  
  useEffect(() => {
    if (location.state) {
      setResume(location.state as ResponseType);
    }
  }, [location.state]);

  useEffect(() => {
    if (loading || !isLoggedIn || !resume) return;

    const fetchResume = (resumeBytes: string, mimeType: string) => {
      const base64 = resumeBytes.replace(/-/g, '+').replace(/_/g, '/');

      const byteChars = atob(base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      setResumeUrl(URL.createObjectURL(blob));
    };

    const fetchImage = (imageBytes: string, mimeType: string) => {
      const base64 = imageBytes.replace(/-/g, '+').replace(/_/g, '/');

      const byteChars = atob(base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      setImageUrl(URL.createObjectURL(blob));
    };

    fetchImage(resume.image, "image/png");
    fetchResume(resume.resumePdf, "application/pdf");

    
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };

  }, [resume, isLoggedIn, loading]);

  
  const feedbackData = (() => {
    if (!resume?.feedback) return null;
    try {
      return JSON.parse(resume.feedback);
    } catch {
      return null;
    }
  })();

  return (
    <main className='!pt-0'>
      <nav className='resume-nav'>
        <Link to='/' className='back-button'>
          <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5' />
          <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {resume && imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className='w-full' />
          )}
        </section>

        <div className="feedback-section">
          <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
          {feedbackData ? (
            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
              <Summary feedback={feedbackData} />
              <ATS score={feedbackData.overallScore || 0} suggestions={feedbackData.ATS?.tips || []} />
              <Details feedback={feedbackData} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className='w-full' />
          )}
        </div>
      </div>
    </main>
  );
};

export default Resume;
