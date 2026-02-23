export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
      };
      tracks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          artist: string | null;
          album: string | null;
          duration_sec: number;
          storage_path: string;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          artist?: string | null;
          album?: string | null;
          duration_sec: number;
          storage_path: string;
          mime_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          artist?: string | null;
          album?: string | null;
          duration_sec?: number;
          storage_path?: string;
          mime_type?: string;
          created_at?: string;
        };
      };
      playlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      playlist_tracks: {
        Row: {
          playlist_id: string;
          track_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          playlist_id: string;
          track_id: string;
          position: number;
          added_at?: string;
        };
        Update: {
          playlist_id?: string;
          track_id?: string;
          position?: number;
          added_at?: string;
        };
      };
      play_history: {
        Row: {
          id: string;
          user_id: string;
          track_id: string;
          played_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          track_id: string;
          played_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          track_id?: string;
          played_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Track = Database["public"]["Tables"]["tracks"]["Row"];
export type Playlist = Database["public"]["Tables"]["playlists"]["Row"];
export type PlaylistTrack = Database["public"]["Tables"]["playlist_tracks"]["Row"];
export type PlayHistory = Database["public"]["Tables"]["play_history"]["Row"];
