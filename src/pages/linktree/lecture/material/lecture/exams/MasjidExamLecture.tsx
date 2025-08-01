import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";
import { colors } from "@/constants/colorsThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface LectureExamQuestion {
  lecture_sessions_question_id: string;
  lecture_sessions_question: string;
  lecture_sessions_question_answers: string[];
  lecture_sessions_question_correct: string;
  lecture_sessions_question_explanation: string;
}

export default function MasjidExamLecture() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { isDark } = useHtmlDarkMode();
  const theme = isDark ? colors.dark : colors.light;
  const startTimeRef = useRef<number>(Date.now());

  const { data, isLoading } = useQuery({
    queryKey: ["exam-questions", id],
    queryFn: async () => {
      const res = await axios.get(
        `/public/lecture-exams/${id}/questions/by-lecture`
      );
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const [wrongQuestions, setWrongQuestions] = useState<LectureExamQuestion[]>(
    []
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  const questions: LectureExamQuestion[] = isRetrying
    ? wrongQuestions
    : data?.questions || [];

  useEffect(() => {
    const durationSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

    if (isRetrying && wrongQuestions.length === 0) {
      navigate(`/masjid/${slug}/tema/${id}/ujian/hasil`, {
        state: {
          correct: progressCount,
          total: data?.questions?.length || 1,
          duration: durationSec,
          id,
          slug,
          exam_id: data.exam_id, // ← tambahkan ini
        },
      });
    }
  }, [isRetrying, wrongQuestions.length]);

  if (isLoading) {
    return <div className="p-4">Memuat soal...</div>;
  }

  if (!data || !data.questions?.length) {
    return (
      <div className="p-4 pb-28">
        <PageHeaderUser title="Latihan Soal" onBackClick={() => navigate(-1)} />
        <div className="mt-4 text-sm text-center text-gray-500 dark:text-white/70">
          Belum ada soal tersedia untuk sesi ini.
        </div>
      </div>
    );
  }

  const question = questions[index];

  const handleCheck = () => {
    if (!selected) return;
    const correct = question.lecture_sessions_question_correct;
    const isRight = selected.startsWith(correct);
    setIsCorrect(isRight);
    setShowAnswer(true);

    if (!isRight) {
      const updated = [...questions, question];
      isRetrying
        ? setWrongQuestions(updated)
        : setWrongQuestions((prev) => [...prev, question]);
    } else {
      setProgressCount((prev) => prev + 1);
      if (isRetrying) {
        setWrongQuestions((prev) =>
          prev.filter(
            (q) =>
              q.lecture_sessions_question_id !==
              question.lecture_sessions_question_id
          )
        );
      }
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    setSelected(null);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else if (!isRetrying && wrongQuestions.length > 0) {
      setIndex(0);
      setIsRetrying(true);
    } else if (isRetrying && wrongQuestions.length > 0) {
      setIndex(0);
    } else {
      const durationSec = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      navigate(`/masjid/${slug}/tema/${id}/ujian/hasil`, {
        state: {
          correct: progressCount,
          total: data?.questions?.length || 1,
          duration: durationSec,
          id,
          slug,
          exam_id: data.exam_id, // ← tambahkan ini
        },
      });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <PageHeaderUser title="Latihan Soal" onBackClick={() => navigate(-1)} />

      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-white/10 mb-6 mt-2">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${(progressCount / (data?.questions?.length || 1)) * 100}%`,
            backgroundColor: theme.primary,
          }}
        />
      </div>

      <p className="text-sm font-medium mb-4" style={{ color: theme.black1 }}>
        {question.lecture_sessions_question}
      </p>

      <div className="space-y-3 mb-6">
        {question.lecture_sessions_question_answers.map((opt) => {
          const isSel = selected === opt;
          const isUserAnswerCorrect = selected?.startsWith(
            question.lecture_sessions_question_correct
          );
          const isRight = showAnswer && isUserAnswerCorrect && isSel;
          const isWrong = showAnswer && !isUserAnswerCorrect && isSel;

          return (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              disabled={showAnswer}
              className={clsx(
                "w-full px-4 py-3 rounded-lg text-sm text-left border transition-all font-medium",
                isSel && !showAnswer ? "text-white" : ""
              )}
              style={{
                backgroundColor: showAnswer
                  ? isRight
                    ? theme.success2
                    : isWrong
                      ? theme.error2
                      : theme.white3
                  : isSel
                    ? theme.primary
                    : theme.white3,
                color: showAnswer
                  ? theme.black1
                  : isSel
                    ? theme.white1
                    : theme.black1,
                borderColor: showAnswer
                  ? isRight
                    ? theme.success1
                    : isWrong
                      ? theme.error1
                      : theme.silver1
                  : isSel
                    ? theme.primary
                    : theme.silver1,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showAnswer && isCorrect && (
        <div
          className="text-sm mb-4 p-3 rounded"
          style={{ backgroundColor: theme.success2, color: theme.success1 }}
        >
          <strong>✅ Jawaban Benar</strong>
          <br />
          {question.lecture_sessions_question_explanation}
        </div>
      )}

      {!showAnswer ? (
        <button
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor: selected ? theme.primary : theme.silver2,
            color: theme.white1,
          }}
          onClick={handleCheck}
          disabled={!selected}
        >
          Cek
        </button>
      ) : (
        <button
          className="w-full py-3 mt-3 rounded-lg text-sm font-semibold transition-all"
          style={{ backgroundColor: theme.primary, color: theme.white1 }}
          onClick={handleNext}
        >
          Lanjut
        </button>
      )}
    </div>
  );
}
