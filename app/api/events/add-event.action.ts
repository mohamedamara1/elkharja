"use server";
import { google } from "googleapis";

export async function createEventSheet(username: string, eventReference: any) {
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

  const sheetData = await glSheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    range: `${eventReference}!A1:AC1000`,
  });

  const headers = sheetData.data.values ? sheetData.data.values[0] : [];

  const addSheetResponse = await glSheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: eventReference,
            },
          },
        },
      ],
    },
  });

  const newSheetId =
    addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;

  await glSheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    range: `${eventReference}!A1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [headers],
    },
  });

  await glSheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    range: `${eventReference}!A2`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[username]],
    },
  });

  return addSheetResponse.data;
}
