import { useState, useEffect } from "react";
import type { ResumeData } from "@/types/resume";

// Resume data is fetched from rxresu.me at build time (scripts/fetch-resume.mjs)
// and served same-origin, avoiding CORS and keeping the API key out of the bundle.
const RESUME_URL = import.meta.env.PUBLIC_FALLBACK_URL || "/portfolio_raw.json";

export const useResumeData = () => {
	const [data, setData] = useState<ResumeData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(RESUME_URL);
				if (!response.ok) {
					throw new Error(
						`Failed to load resume data: ${response.status} ${response.statusText}`
					);
				}
				setData(await response.json());
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, loading, error };
};
