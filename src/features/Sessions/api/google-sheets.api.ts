/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IAvailableSessionsResponse,
  IAvailableSession,
  IGetAvailableSessionsResult,
} from '../types/sessions.types';

// Replace this with your deployed Google Apps Script Web App URL
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE3QF4wJU4az8HwTV1X9APUyEaI695LBFDDv-A7K8Mkhlw2jYiDAq30nl65iYfIzIVVA/exec';



export const googleSheetsAPI = {
  getAvailableSessions: async (page = 1): Promise<IGetAvailableSessionsResult> => {
    try {
      let sheetsSessions: IAvailableSession[] = [];
      
      // Fetch from Google Apps Script if URL is configured
      if (GOOGLE_APPS_SCRIPT_URL !== 'YOUR_WEB_APP_URL_HERE') {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        const data: any = await response.json();
        console.log("Google Sheets response:", data);
        if (data && data.sessions) {
          // Convert ids to strings and ensure no missing properties crash the app
          sheetsSessions = data.sessions.map((s: any) => ({
            ...s,
            id: String(s.id),
            session_date: String(s.session_date || ''),
            session_time: String(s.session_time || ''),
            location: s.location || null,
            is_past: s.is_past === true || String(s.is_past).toLowerCase() === 'true'
          }));
        }
      }
      
      // Use only fetched sessions
      const allSessions = [...sheetsSessions];
      
      // Simple pagination logic
      const limit = 10;
      const total = allSessions.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedSessions = allSessions.slice(start, start + limit);
      
      return {
        sessions: paginatedSessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
      };
    } catch (error) {
      console.error('Failed to fetch sessions from Google Sheets:', error);
      // Fallback to empty
      return {
        sessions: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    }
  },

  searchSessionsByDate: async (date: string, page = 1): Promise<IGetAvailableSessionsResult> => {
    try {
      let sheetsSessions: IAvailableSession[] = [];
      
      if (GOOGLE_APPS_SCRIPT_URL !== 'YOUR_WEB_APP_URL_HERE') {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        const data: any = await response.json();
        console.log("Google Sheets response (search):", data);
        if (data && data.sessions) {
          sheetsSessions = data.sessions.map((s: any) => ({
            ...s,
            id: String(s.id),
            session_date: String(s.session_date || ''),
            session_time: String(s.session_time || ''),
            location: s.location || null,
            is_past: s.is_past === true || String(s.is_past).toLowerCase() === 'true'
          }));
        }
      }
      
      const allSessions = [...sheetsSessions];
      const filteredSessions = allSessions.filter(s => {
        // Parse date to be safe or just do simple string includes
        return s.session_date.includes(date);
      });
      
      const limit = 10;
      const total = filteredSessions.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedSessions = filteredSessions.slice(start, start + limit);
      
      return {
        sessions: paginatedSessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
      };
    } catch (error) {
       console.error('Failed to search sessions from Google Sheets:', error);
       // Fallback
       return {
         sessions: [],
         pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
       };
    }
  },

  checkLaunchStatus: async (): Promise<boolean> => {
    try {
      if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') return true;
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
      const data: any = await response.json();
      if (data && data.launch && data.launch.length > 0) {
        return data.launch[0].is_launched === true || String(data.launch[0].is_launched).toLowerCase() === 'true';
      }
      return false; // Default to not launched if missing
    } catch (error) {
      console.error('Failed to check launch status:', error);
      return true; // Fail open to not lock users out
    }
  },

  setLaunchStatus: async (status: boolean): Promise<void> => {
    try {
      if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') return;
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'set_launched', is_launched: status }),
      });
    } catch (error) {
      console.error('Failed to set launch status:', error);
    }
  }
};
