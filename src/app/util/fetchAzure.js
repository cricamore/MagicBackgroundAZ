const sendImage = async (formData, endpoint) => {
    try {
      const response = await fetch(endpoint + "computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval", {
        method: "POST",
        body: formData,
        headers: new Headers({
          // "content-type": "multipart/form-data",
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_AZURE_KEY,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }),
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }