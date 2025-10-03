import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import type { ResponseType } from "~/components/ResumeCard";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}


export default function Home() {
  const navigate = useNavigate();
  const {login, isLoggedIn, loading} = useAuth();
  const [responses, setResponses] = useState<ResponseType[]>([]);

    useEffect(()  => {
      if (isLoggedIn === false) {
        navigate(`/auth?next=/`);
      }

      const fetchResponses = async () => {
        try {
          if (isLoggedIn === false) {
            navigate(`/auth?next=/`);
          }

          const userId = localStorage.getItem("userId");
          const res = await fetch(`https://ai-resume-screener-y8k8.onrender.com/api/resume/user/${userId}/responses`, {
            headers: { 
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch responses");
          }

          const data = await res.json();
          setResponses(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchResponses();

    }, [isLoggedIn, navigate]);
  
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover  " >
    <Navbar />
    <section className="main-section" >
      <div className="page-heading py-16 ">
        <h1>Track your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
    
      {responses.length > 0 && (
        <div className="resumes-section">
          {responses.map( (response) => (
            <ResumeCard  key={response.id} resume = {response} />
          ))}
        </div>
      )}
    
    </section>
    
  </main>;
}
