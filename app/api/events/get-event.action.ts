"use server";
import { google } from "googleapis";

export async function getSheetData(eventReference: string) {
  // Example usage
  const sheetId = eventReference;
  const range = "A1:AC1000";

  const glAuth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const glSheets = google.sheets({ version: "v4", auth: glAuth });
  const data = await glSheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    range: `${sheetId}!${range}`,
  });

  return { data: data.data.values };
}
