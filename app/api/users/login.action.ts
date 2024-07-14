"use server";
import { google } from "googleapis";

interface LoginResponse {
  authenticated: boolean;
}

export async function login(
  username: string,
  password: string,
  eventReference: string,
): Promise<LoginResponse> {
  try {
    // Authenticate with Google Sheets API
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

    // Read the credentials from the spreadsheet
    const sheetData = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_DOC_ID,
      range: `${eventReference}!A1:AD1000`, // Adjusted range to include column AD
    });

    const credentials = sheetData.data.values || [];
    let foundUser = credentials.find((row) => row[0] === username); // Adjusted index to check against column AD
    console.log("foundUser", foundUser);
    if (!foundUser) {
      // If user not found, create a new user row
      const newUserRow = [username, ...Array(28).fill(""), password]; // Assuming 30 columns before password in AD

      // Determine the last row index
      const lastRowIndex = credentials.length > 0 ? credentials.length : 0;

      // Append the new user row after the last existing row
      await glSheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_DOC_ID,
        range: `${eventReference}!A${lastRowIndex + 1}`, // Append after the last row
        valueInputOption: "RAW",
        requestBody: {
          values: [newUserRow],
        },
      });
      foundUser = newUserRow; // Set foundUser to newly created user row
    }
    if (foundUser && foundUser[29] === password) {
      // Adjusted index to check against column AD
      // Authentication successful
      return { authenticated: true };
    } else {
      // Authentication failed
      return { authenticated: false };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { authenticated: false };
  }
}
