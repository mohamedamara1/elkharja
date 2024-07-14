"use server";
import { google } from "googleapis";

export async function updateUserAvailability(
  eventReference: string,
  username: string,
  availability: any,
) {
  const glAuth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  // Read the existing data from the event sheet
  const sheetData = await glSheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_DOC_ID,
    range: `${eventReference}!A1:AC1000`, // Adjust the range if needed
  });

  const rows = sheetData.data.values ? sheetData.data.values : [];
  let userRowIndex = -1;

  // Find the user row index if the user already exists
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username) {
      userRowIndex = i;
      break;
    }
  }

  // Update the user data
  const userData = [username, ...availabilityToRow(availability)];

  if (userRowIndex !== -1) {
    const existingRow = rows[userRowIndex];
    const mergedAvailability = mergeAvailability(
      existingRow.slice(1),
      availability,
    );
    const userData = [username, ...mergedAvailability];
    // Update the existing user row
    await glSheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_DOC_ID,
      range: `${eventReference}!A${userRowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [userData],
      },
    });
  } else {
    // Append a new user row
    await glSheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_DOC_ID,
      range: `${eventReference}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [userData],
      },
    });
  }

  return { status: "success", updatedUser: username, userRowIndex };
}

function mergeAvailability(
  existingAvailability: any[],
  newAvailability: any,
): string[] {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const times = ["morning", "afternoon", "evening", "night"];
  let merged: string[] = [];

  let index = 0;
  days.forEach((day) => {
    times.forEach((time) => {
      const newValue =
        newAvailability[day]?.[time] ||
        existingAvailability[index] ||
        "unknown";
      merged.push(newValue);
      index++;
    });
  });

  return merged;
}
function availabilityToRow(availability: any): string[] {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const times = ["morning", "afternoon", "evening", "night"];
  let row: string[] = [];

  days.forEach((day) => {
    times.forEach((time) => {
      row.push(availability[day]?.[time] || "unknown");
    });
  });

  return row;
}
