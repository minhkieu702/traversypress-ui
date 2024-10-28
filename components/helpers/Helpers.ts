const convertToBinaryString = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        resolve(binaryString);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };
  
 export const convertImageListToBinaryStrings = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => convertToBinaryString(file));
    return Promise.all(promises);
  };
  
  export const logFormData = (formData: FormData) => {
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };