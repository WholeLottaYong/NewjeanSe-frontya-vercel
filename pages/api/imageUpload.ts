import os from "os";
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadDir = path.join(process.cwd(), "/public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true }); // 디렉토리 생성, 이미 존재하면 무시

  const form = formidable({
    uploadDir: uploadDir, // public/uploads 디렉토리 설정
    keepExtensions: true, // 파일 확장자 유지
    maxFileSize: 50 * 1024 * 1024, // 최대 파일 크기 설정 (50MB)
    multiples: false, // 여러 파일 업로드 비활성화
  });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error("Formidable Error:", err);
      res.status(500).json({ message: "파일 업로드 실패" });
      return;
    }

    const file = files.file;

    if (file && Array.isArray(file)) {
      const singleFile = file[0];
      await sendFileToFlask(singleFile, res);
    } else if (file) {
      const singleFile = file as File;
      await sendFileToFlask(singleFile, res);
    } else {
      res.status(400).json({ message: "업로드된 파일이 없습니다" });
    }
  });
};

const sendFileToFlask = async (file: File, res: NextApiResponse) => {
  const formData = new FormData();
  formData.append(
    "file",
    fs.createReadStream(file.filepath),
    file.originalFilename || file.newFilename
  );

  try {
    const response = await axios.post(
      "http://localhost:5000/upload", // flask 서버의 엔드 포인트 URL
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // Flask 서버로부터 받은 결과에 업로드된 파일의 경로 추가
    const responseData = response.data;
    responseData.imagePath = `/uploads/${file.newFilename}`;

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error sending file to Flask server:", error.message);
    res.status(500).json({ message: "OCR 서버에 이미지 업로드 실패" });
  }
};

export default handler;
