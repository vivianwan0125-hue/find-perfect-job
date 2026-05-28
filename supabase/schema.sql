-- =============================================
-- 秋招岗位管理系统 - Supabase 数据库结构
-- 在 Supabase Dashboard > SQL Editor 中运行此脚本
-- =============================================

-- Jobs 主表
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  position_name TEXT NOT NULL,
  position_type TEXT NOT NULL DEFAULT '其他',
  work_location TEXT,
  deadline DATE,
  requirements TEXT,
  apply_url TEXT,
  status TEXT NOT NULL DEFAULT '待投递',
  priority TEXT NOT NULL DEFAULT '中',
  notes TEXT,
  source TEXT NOT NULL DEFAULT '手动添加',
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 爬虫网站表
CREATE TABLE IF NOT EXISTS crawler_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  last_crawled_at TIMESTAMPTZ,
  jobs_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 系统设置表（单行）
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ai_base_url TEXT DEFAULT 'https://api.openai.com/v1',
  ai_api_key TEXT,
  ai_model TEXT DEFAULT 'gpt-4o-mini',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 插入默认设置行
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 自动更新 updated_at 函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- jobs 表触发器
DROP TRIGGER IF EXISTS set_jobs_updated_at ON jobs;
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- settings 表触发器
DROP TRIGGER IF EXISTS set_settings_updated_at ON settings;
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 去重唯一索引（公司名+岗位名+地点）
CREATE UNIQUE INDEX IF NOT EXISTS jobs_dedup_idx
  ON jobs (company_name, position_name, COALESCE(work_location, ''));

-- 开启行级安全
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawler_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 允许匿名访问（个人工具）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Allow all operations') THEN
    CREATE POLICY "Allow all operations" ON jobs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'crawler_sites' AND policyname = 'Allow all operations') THEN
    CREATE POLICY "Allow all operations" ON crawler_sites FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Allow all operations') THEN
    CREATE POLICY "Allow all operations" ON settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;
