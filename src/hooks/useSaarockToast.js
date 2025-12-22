import React, { useEffect, useState } from "react";

const useSaarockToast = () => {
    const [saarockToast, setSaarockToast] = useState();
  useEffect(() => {
    (async () => {
      const { saarock } = await import(
        "https://cdn.jsdelivr.net/gh/saarock/saarock.js@main/dist/index.js"
      );

      setSaarockToast(saarock)
    })();
  }, []);

  return {
    saarockToast,
  };
};

export default useSaarockToast;
