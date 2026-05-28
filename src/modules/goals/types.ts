export interface Goal {
  id: string;
  user_id: string;
  type: 'financial' | 'productivity';
  title: string;
  target_value: number;
  current_value: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}
