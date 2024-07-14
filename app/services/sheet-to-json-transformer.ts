const finalMembers: Member[] = [
  {
    name: "John",
    availability: {
      monday: {
        morning: "yes",
        afternoon: "no",
        evening: "yes",
        night: "unknown",
      },
      tuesday: {
        morning: "no",
        afternoon: "yes",
        evening: "unknown",
        night: "yes",
      },
      wednesday: {
        morning: "yes",
        afternoon: "yes",
        evening: "unknown",
        night: "unknown",
      },
      thursday: {
        morning: "no",
        afternoon: "no",
        evening: "yes",
        night: "yes",
      },
      friday: {
        morning: "yes",
        afternoon: "yes",
        evening: "yes",
        night: "unknown",
      },
      saturday: {
        morning: "unknown",
        afternoon: "no",
        evening: "unknown",
        night: "yes",
      },
      sunday: {
        morning: "yes",
        afternoon: "yes",
        evening: "unknown",
        night: "unknown",
      },
    },
  },
  {
    name: "Bob",
    availability: {
      monday: {
        morning: "yes",
        afternoon: "maybe",
        evening: "unknown",
        night: "maybe",
      },
      tuesday: { morning: "no", afternoon: "no", evening: "yes", night: "yes" },
      wednesday: {
        morning: "yes",
        afternoon: "no",
        evening: "yes",
        night: "unknown",
      },
      thursday: {
        morning: "no",
        afternoon: "yes",
        evening: "unknown",
        night: "yes",
      },
      friday: {
        morning: "yes",
        afternoon: "no",
        evening: "yes",
        night: "unknown",
      },
      saturday: {
        morning: "unknown",
        afternoon: "yes",
        evening: "unknown",
        night: "yes",
      },
      sunday: {
        morning: "yes",
        afternoon: "no",
        evening: "yes",
        night: "unknown",
      },
    },
  },
];
import { sheets_v4 } from "googleapis"; // Import the appropriate Google Sheets API typings
import { Member } from "../../types/event";

export const sheetTransformer = (sheetData: any): Member[] => {
  const members: Member[] = [];

  try {
    if (sheetData) {
      // Extract headers and data rows
      const headers = sheetData[0];
      const dataRows = sheetData.slice(1);

      // Iterate over each row of data
      dataRows.forEach((row: any) => {
        // Assuming the first element of each row is the member's name
        const name = row[0];

        // Initialize availability object
        const availability = {
          monday: {
            morning: row[1] || "unknown",
            afternoon: row[2] || "unknown",
            evening: row[3] || "unknown",
            night: row[4] || "unknown",
          },
          tuesday: {
            morning: row[5] || "unknown",
            afternoon: row[6] || "unknown",
            evening: row[7] || "unknown",
            night: row[8] || "unknown",
          },
          wednesday: {
            morning: row[9] || "unknown",
            afternoon: row[10] || "unknown",
            evening: row[11] || "unknown",
            night: row[12] || "unknown",
          },
          thursday: {
            morning: row[13] || "unknown",
            afternoon: row[14] || "unknown",
            evening: row[15] || "unknown",
            night: row[16] || "unknown",
          },
          friday: {
            morning: row[17] || "unknown",
            afternoon: row[18] || "unknown",
            evening: row[19] || "unknown",
            night: row[20] || "unknown",
          },
          saturday: {
            morning: row[21] || "unknown",
            afternoon: row[22] || "unknown",
            evening: row[23] || "unknown",
            night: row[24] || "unknown",
          },
          sunday: {
            morning: row[25] || "unknown",
            afternoon: row[26] || "unknown",
            evening: row[27] || "unknown",
            night: row[28] || "unknown",
          },
        };

        // Construct member object
        const member: Member = {
          name,
          availability,
        };

        // Push member into members array
        members.push(member);
      });
    } else {
      console.error("No values found in the sheet data.");
    }
  } catch (e) {
    console.error("Error transforming sheet data:", e);
  }

  // Now 'members' array contains the transformed data
  console.log(members);
  return members;
};
