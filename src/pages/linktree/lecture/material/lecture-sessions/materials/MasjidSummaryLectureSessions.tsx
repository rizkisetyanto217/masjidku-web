import PageHeader from "@/components/common/home/PageHeaderUser";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";
import { colors } from "@/constants/colorsThema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import FormattedDate from "@/constants/formattedDate";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import { decode } from "html-entities";
import parse from "html-react-parser";
import cleanTranscriptHTML from "@/constants/cleanTransciptHTML";

export default function MasjidSummaryLectureSessions() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useHtmlDarkMode();
  const theme = isDark ? colors.dark : colors.light;
  const { id: lecture_session_id } = useParams();
  const location = useLocation();

  const backUrl = location.state?.from || `/masjid/${slug}/soal-materi/${id}`;

  // 📥 Fetch detail sesi kajian
  const {
    data: sessionDetail,
    isLoading: isLoadingSession,
    isError: isErrorSession,
  } = useQuery({
    queryKey: ["lecture-session-detail", lecture_session_id],
    queryFn: async () => {
      const res = await axios.get(
        `/public/lecture-sessions-u/by-id/${lecture_session_id}`
      );
      console.log("📦 Data sesi kajian:", res.data);
      return res.data;
    },
    enabled: !!lecture_session_id,
    staleTime: 1000 * 60 * 5,
  });

  // 📥 Fetch ringkasan materi
  const {
    data: materialData,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useQuery({
    queryKey: ["public-lecture-session-summary", lecture_session_id],
    queryFn: async () => {
      const res = await axios.get(
        `/public/lecture-sessions-materials/filter?lecture_session_id=${lecture_session_id}&type=summary`
      );
      console.log("📘 Data ringkasan:", res.data);
      return res?.data?.data?.[0] ?? null;
    },
    enabled: !!lecture_session_id,
    staleTime: 1000 * 60 * 5,
  });

  const summary = materialData?.lecture_sessions_material_summary || "";

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeaderUser
        title="Ringkasan Kajian"
        onBackClick={() => navigate(backUrl)}
      />

      <div
        className="p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: theme.white1, color: theme.black1 }}
      >
        {isLoadingSession || isLoadingSummary ? (
          <p>Memuat data...</p>
        ) : isErrorSession ? (
          <p className="text-red-500">Gagal memuat detail sesi kajian.</p>
        ) : isErrorSummary ? (
          <p className="text-red-500">Gagal memuat ringkasan kajian.</p>
        ) : (
          <>
            <div className="space-y-1 mb-4">
              <h2 className="text-base font-semibold text-sky-600">
                {sessionDetail?.lecture_session_title || "-"}
              </h2>
              <p className="text-sm text-gray-500">
                {sessionDetail?.lecture_session_start_time && (
                  <FormattedDate
                    value={sessionDetail.lecture_session_start_time}
                    fullMonth
                    className="inline"
                  />
                )}{" "}
                / {sessionDetail?.lecture_session_place || "-"}
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: theme.primary }}
              >
                {sessionDetail?.lecture_session_teacher_name || "-"}
              </p>
            </div>

            <div
              className="space-y-4 text-sm leading-relaxed text-justify"
              style={{ color: theme.black1 }}
            >
              {summary ? (
                <div className="whitespace-pre-wrap text-sm text-justify leading-relaxed">
                  {parse(cleanTranscriptHTML(summary))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  Belum ada materi lengkap tersedia.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
