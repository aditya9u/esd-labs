// Lab day (AI required). This file ends up as the hook described in CONTRACT.md §4.
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        const loadedCourses = await apiFetch("/api/courses");
        if (!ignore) {
          setCourses(loadedCourses);
          setStatus("ready");
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
          setStatus("error");
        }
      }
    }

    loadCourses();
    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });
    setCourses((current) =>
      [...current, created].sort((a, b) => a.code.localeCompare(b.code))
    );
    return created;
  }

  return { courses, status, error, addCourse };
}
