import { createClient } from '@supabase/supabase-js';
import * as vscode from 'vscode';

export class SupabaseClient {
  private static instance: SupabaseClient;
  private supabase: any;
  
  private constructor() {
    const config = vscode.workspace.getConfiguration('codingTracker');
    const supabaseUrl = config.get('supabaseUrl') || '';
    const supabaseKey = config.get('supabaseKey') || '';
    
    // Supabaseクライアントの初期化
    this.supabase = createClient(supabaseUrl as string, supabaseKey as string);
  }
  
  public static getInstance(): SupabaseClient {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = new SupabaseClient();
    }
    return SupabaseClient.instance;
  }
  
  // ユーザー認証（オプション）
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
  // アクティビティデータの保存
  async saveActivities(activities: any[]) {
    // ユーザーIDの取得（認証済みの場合）
    const { data: { user } } = await this.supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // 保存するデータの準備
    const activitiesWithUserId = activities.map(activity => ({
      ...activity,
      user_id: userId
    }));
    
    // データの保存
    const { data, error } = await this.supabase
      .from('coding_activities')
      .insert(activitiesWithUserId);
    
    if (error) throw error;
    return data;
  }
  
  // 期間を指定してアクティビティを取得
  async getActivities(startDate?: number, endDate?: number) {
    // ユーザーIDの取得
    const { data: { user } } = await this.supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // クエリの構築
    let query = this.supabase
      .from('coding_activities')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    // 期間フィルターの追加
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    
    // クエリの実行
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
}