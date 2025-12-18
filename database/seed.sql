-- =====================================================
-- MATCHOP SEED DATA - Tunisian Companies & Job Offers
-- Run this after schema.sql to populate the database
-- =====================================================

-- First, create a system user for seeding (bypass RLS)
-- Note: Run as postgres/service_role, not anon

-- Create profiles for all companies
INSERT INTO profiles (id, type, name, email, created_at) VALUES
('00000000-0000-0000-0001-000000000001', 'company', 'InstaDeep', 'contact@instadeep.com', NOW()),
('00000000-0000-0000-0001-000000000002', 'company', 'Kaoun Technologies', 'contact@kaoun.com', NOW()),
('00000000-0000-0000-0001-000000000003', 'company', 'Kumulus Water', 'contact@kumulus-water.com', NOW()),
('00000000-0000-0000-0001-000000000004', 'company', 'Datavizion AI', 'contact@datavizion.ai', NOW()),
('00000000-0000-0000-0001-000000000005', 'company', 'LaFlamme', 'contact@laflamme.tn', NOW()),
('00000000-0000-0000-0001-000000000006', 'company', 'SMOFT ERP', 'contact@smoft.com', NOW()),
('00000000-0000-0000-0001-000000000007', 'company', 'Cynoia', 'contact@cynoia.com', NOW()),
('00000000-0000-0000-0001-000000000008', 'company', 'Kamioun', 'contact@kamioun.com', NOW()),
('00000000-0000-0000-0001-000000000009', 'company', 'Myda', 'contact@myda.tn', NOW()),
('00000000-0000-0000-0001-000000000010', 'company', 'Siladoc', 'contact@siladoc.com', NOW()),
('00000000-0000-0000-0001-000000000011', 'company', 'Next Consult', 'contact@nextconsult.tn', NOW()),
('00000000-0000-0000-0001-000000000012', 'company', 'MedTech Tunisia', 'contact@medtechtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000013', 'company', 'Smart Tunisie', 'contact@smarttunisie.com', NOW()),
('00000000-0000-0000-0001-000000000014', 'company', 'Tunisie Logistique', 'contact@tunisielogistique.com', NOW()),
('00000000-0000-0000-0001-000000000015', 'company', 'EcoTech Tunisia', 'contact@ecotechtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000016', 'company', 'DevOps Tunisia', 'contact@devopstunisia.com', NOW()),
('00000000-0000-0000-0001-000000000017', 'company', 'AgriTech Tunisia', 'contact@agritechtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000018', 'company', 'EdTech Tunisia', 'contact@edtechtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000019', 'company', 'Energy Tunisia', 'contact@energytunisia.com', NOW()),
('00000000-0000-0000-0001-000000000020', 'company', 'Finance Tunisia', 'contact@financetunisia.com', NOW()),
('00000000-0000-0000-0001-000000000021', 'company', 'FoodTech Tunisia', 'contact@foodtechtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000022', 'company', 'HR Tunisia', 'contact@hrtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000023', 'company', 'Insurance Tunisia', 'contact@insurancetunisia.com', NOW()),
('00000000-0000-0000-0001-000000000024', 'company', 'Legal Tunisia', 'contact@legaltunisia.com', NOW()),
('00000000-0000-0000-0001-000000000025', 'company', 'Marketing Tunisia', 'contact@marketingtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000026', 'company', 'Media Tunisia', 'contact@mediatunisia.com', NOW()),
('00000000-0000-0000-0001-000000000027', 'company', 'Mobile Tunisia', 'contact@mobiletunisia.com', NOW()),
('00000000-0000-0000-0001-000000000028', 'company', 'Security Tunisia', 'contact@securitytunisia.com', NOW()),
('00000000-0000-0000-0001-000000000029', 'company', 'Software Tunisia', 'contact@softwaretunisia.com', NOW()),
('00000000-0000-0000-0001-000000000030', 'company', 'Telecom Tunisia', 'contact@telecomtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000031', 'company', 'Travel Tunisia', 'contact@traveltunisia.com', NOW()),
('00000000-0000-0000-0001-000000000032', 'company', 'Web Tunisia', 'contact@webtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000033', 'company', 'Design Tunisia', 'contact@designtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000034', 'company', 'Video Tunisia', 'contact@videotunisia.com', NOW()),
('00000000-0000-0000-0001-000000000035', 'company', 'Fashion Tunisia', 'contact@fashiontunisia.com', NOW()),
('00000000-0000-0000-0001-000000000036', 'company', 'Sport Tunisia', 'contact@sporttunisia.com', NOW()),
('00000000-0000-0000-0001-000000000037', 'company', 'Education Tunisia', 'contact@educationtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000038', 'company', 'Engineering Tunisia', 'contact@engineeringtunisia.com', NOW()),
('00000000-0000-0000-0001-000000000039', 'company', 'Architecture Tunisia', 'contact@architecttunisia.com', NOW()),
('00000000-0000-0000-0001-000000000040', 'company', 'Construction Tunisia', 'contact@constructiontunisia.com', NOW()),
('00000000-0000-0000-0001-000000000041', 'company', 'Real Estate Tunisia', 'contact@realestatetunisia.com', NOW()),
('00000000-0000-0000-0001-000000000042', 'company', 'Property Tunisia', 'contact@propertytunisia.com', NOW()),
('00000000-0000-0000-0001-000000000043', 'company', 'Groupe Chimique Tunisien', 'contact@gct.com.tn', NOW()),
('00000000-0000-0000-0001-000000000044', 'company', 'Groupe SFBT', 'contact@sfbtnet.com', NOW()),
('00000000-0000-0000-0001-000000000045', 'company', 'Groupe Poulina', 'contact@poulina.com', NOW()),
('00000000-0000-0000-0001-000000000046', 'company', 'Groupe Mabrouk', 'contact@mabrouk.com', NOW()),
('00000000-0000-0000-0001-000000000047', 'company', 'Groupe TTS', 'contact@tts.com', NOW()),
('00000000-0000-0000-0001-000000000048', 'company', 'Groupe Elloumi', 'contact@elloumi.com', NOW()),
('00000000-0000-0000-0001-000000000049', 'company', 'El Mouradi', 'contact@elmouradi.com', NOW()),
('00000000-0000-0000-0001-000000000050', 'company', 'Groupe Karthago', 'contact@karthago.com', NOW()),
('00000000-0000-0000-0001-000000000051', 'company', 'Groupe Délice', 'contact@delice.com', NOW()),
('00000000-0000-0000-0001-000000000052', 'company', 'Groupe One Tech', 'contact@onetech.com', NOW()),
('00000000-0000-0000-0001-000000000053', 'company', 'TELNET HOLDING', 'contact@telnet.com', NOW()),
('00000000-0000-0000-0001-000000000054', 'company', 'STB Bank', 'contact@stb.com', NOW()),
('00000000-0000-0000-0001-000000000055', 'company', 'TUNISAIR', 'contact@tunisair.com', NOW()),
('00000000-0000-0000-0001-000000000056', 'company', 'TUNIS RE', 'contact@tunisre.com', NOW());

-- Create company details
INSERT INTO companies (id, website, sector, size, description, location, contact_email) VALUES
('00000000-0000-0000-0001-000000000001', 'https://instadeep.com', 'AI', '500+', 'AI solutions for global enterprises', 'Tunis', 'contact@instadeep.com'),
('00000000-0000-0000-0001-000000000002', 'https://kaoun.com', 'Fintech', '100+', 'Mobile banking & payments (Flouci)', 'Tunis', 'contact@kaoun.com'),
('00000000-0000-0000-0001-000000000003', 'https://kumulus-water.com', 'Cleantech', '50+', 'Water-from-air solutions', 'Sousse', 'contact@kumulus-water.com'),
('00000000-0000-0000-0001-000000000004', 'https://datavizion.ai', 'Big Data', '50+', 'Data analytics platform', 'Tunis', 'contact@datavizion.ai'),
('00000000-0000-0000-0001-000000000005', 'https://laflamme.tn', 'HealthTech', '20+', 'Mental health platform', 'Tunis', 'contact@laflamme.tn'),
('00000000-0000-0000-0001-000000000006', 'https://smoft.com', 'ERP', '100+', 'ERP software solutions', 'Tunis', 'contact@smoft.com'),
('00000000-0000-0000-0001-000000000007', 'https://cynoia.com', 'Productivity', '50+', 'Productivity apps', 'Tunis', 'contact@cynoia.com'),
('00000000-0000-0000-0001-000000000008', 'https://kamioun.com', 'FMCG', '100+', 'B2B retail marketplace', 'Tunis', 'contact@kamioun.com'),
('00000000-0000-0000-0001-000000000009', 'https://myda.tn', 'AI', '30+', 'AI for food artisans', 'Tunis', 'contact@myda.tn'),
('00000000-0000-0000-0001-000000000010', 'https://siladoc.com', 'HealthTech', '50+', 'Teleconsultation platform', 'Tunis', 'contact@siladoc.com'),
('00000000-0000-0000-0001-000000000011', 'https://nextconsult.tn', 'Web Development', '50+', 'Web & mobile development', 'Tunis', 'contact@nextconsult.tn'),
('00000000-0000-0000-0001-000000000012', 'https://medtechtunisia.com', 'HealthTech', '20+', 'Medical technology', 'Tunis', 'contact@medtechtunisia.com'),
('00000000-0000-0000-0001-000000000013', 'https://smarttunisie.com', 'Smart Cities', '50+', 'Smart city solutions', 'Tunis', 'contact@smarttunisie.com'),
('00000000-0000-0000-0001-000000000014', 'https://tunisielogistique.com', 'Logistics', '100+', 'Logistics & transport', 'Tunis', 'contact@tunisielogistique.com'),
('00000000-0000-0000-0001-000000000015', 'https://ecotechtunisia.com', 'Cleantech', '30+', 'Environmental technology', 'Tunis', 'contact@ecotechtunisia.com'),
('00000000-0000-0000-0001-000000000016', 'https://devopstunisia.com', 'IT', '50+', 'DevOps & cloud services', 'Tunis', 'contact@devopstunisia.com'),
('00000000-0000-0000-0001-000000000017', 'https://agritechtunisia.com', 'Agriculture', '30+', 'AgriTech solutions', 'Tunis', 'contact@agritechtunisia.com'),
('00000000-0000-0000-0001-000000000018', 'https://edtechtunisia.com', 'EdTech', '20+', 'Education platform', 'Tunis', 'contact@edtechtunisia.com'),
('00000000-0000-0000-0001-000000000019', 'https://energytunisia.com', 'Energy', '50+', 'Energy solutions', 'Tunis', 'contact@energytunisia.com'),
('00000000-0000-0000-0001-000000000020', 'https://financetunisia.com', 'Finance', '100+', 'Financial services', 'Tunis', 'contact@financetunisia.com'),
('00000000-0000-0000-0001-000000000021', 'https://foodtechtunisia.com', 'Food', '30+', 'Food technology', 'Tunis', 'contact@foodtechtunisia.com'),
('00000000-0000-0000-0001-000000000022', 'https://hrtunisia.com', 'HR', '20+', 'HR technology', 'Tunis', 'contact@hrtunisia.com'),
('00000000-0000-0000-0001-000000000023', 'https://insurancetunisia.com', 'Insurance', '50+', 'Insurance solutions', 'Tunis', 'contact@insurancetunisia.com'),
('00000000-0000-0000-0001-000000000024', 'https://legaltunisia.com', 'Legal', '20+', 'Legal technology', 'Tunis', 'contact@legaltunisia.com'),
('00000000-0000-0000-0001-000000000025', 'https://marketingtunisia.com', 'Marketing', '50+', 'Digital marketing agency', 'Tunis', 'contact@marketingtunisia.com'),
('00000000-0000-0000-0001-000000000026', 'https://mediatunisia.com', 'Media', '30+', 'Media & content', 'Tunis', 'contact@mediatunisia.com'),
('00000000-0000-0000-0001-000000000027', 'https://mobiletunisia.com', 'Mobile', '50+', 'Mobile app development', 'Tunis', 'contact@mobiletunisia.com'),
('00000000-0000-0000-0001-000000000028', 'https://securitytunisia.com', 'Security', '30+', 'Cybersecurity solutions', 'Tunis', 'contact@securitytunisia.com'),
('00000000-0000-0000-0001-000000000029', 'https://softwaretunisia.com', 'Software', '100+', 'Software development', 'Tunis', 'contact@softwaretunisia.com'),
('00000000-0000-0000-0001-000000000030', 'https://telecomtunisia.com', 'Telecom', '100+', 'Telecommunications', 'Tunis', 'contact@telecomtunisia.com'),
('00000000-0000-0000-0001-000000000031', 'https://traveltunisia.com', 'Travel', '30+', 'Travel technology', 'Tunis', 'contact@traveltunisia.com'),
('00000000-0000-0000-0001-000000000032', 'https://webtunisia.com', 'Web', '50+', 'Web development', 'Tunis', 'contact@webtunisia.com'),
('00000000-0000-0000-0001-000000000033', 'https://designtunisia.com', 'Design', '30+', 'Design agency', 'Tunis', 'contact@designtunisia.com'),
('00000000-0000-0000-0001-000000000034', 'https://videotunisia.com', 'Video', '20+', 'Video production', 'Tunis', 'contact@videotunisia.com'),
('00000000-0000-0000-0001-000000000035', 'https://fashiontunisia.com', 'Fashion', '30+', 'Fashion brand', 'Tunis', 'contact@fashiontunisia.com'),
('00000000-0000-0000-0001-000000000036', 'https://sporttunisia.com', 'Sport', '20+', 'Sports technology', 'Tunis', 'contact@sporttunisia.com'),
('00000000-0000-0000-0001-000000000037', 'https://educationtunisia.com', 'Education', '50+', 'Education platform', 'Tunis', 'contact@educationtunisia.com'),
('00000000-0000-0000-0001-000000000038', 'https://engineeringtunisia.com', 'Engineering', '100+', 'Engineering services', 'Tunis', 'contact@engineeringtunisia.com'),
('00000000-0000-0000-0001-000000000039', 'https://architecttunisia.com', 'Architecture', '50+', 'Architecture firm', 'Tunis', 'contact@architecttunisia.com'),
('00000000-0000-0000-0001-000000000040', 'https://constructiontunisia.com', 'Construction', '100+', 'Construction company', 'Tunis', 'contact@constructiontunisia.com'),
('00000000-0000-0000-0001-000000000041', 'https://realestatetunisia.com', 'Real Estate', '50+', 'Real estate agency', 'Tunis', 'contact@realestatetunisia.com'),
('00000000-0000-0000-0001-000000000042', 'https://propertytunisia.com', 'Property', '50+', 'Property management', 'Tunis', 'contact@propertytunisia.com'),
('00000000-0000-0000-0001-000000000043', 'https://www.gct.com.tn', 'Chemical', '1000+', 'Industrial chemical production', 'Tunis', 'contact@gct.com.tn'),
('00000000-0000-0000-0001-000000000044', 'https://www.sfbtnet.com', 'Agro-food', '1000+', 'Food & beverage processing', 'Tunis', 'contact@sfbtnet.com'),
('00000000-0000-0000-0001-000000000045', 'https://www.poulina.com', 'Agro-food', '1000+', 'Food processing conglomerate', 'Tunis', 'contact@poulina.com'),
('00000000-0000-0000-0001-000000000046', 'https://www.mabrouk.com', 'Agro-food', '1000+', 'Food & retail group', 'Tunis', 'contact@mabrouk.com'),
('00000000-0000-0000-0001-000000000047', 'https://www.tts.com', 'Tourism', '1000+', 'Tourism & transport', 'Tunis', 'contact@tts.com'),
('00000000-0000-0000-0001-000000000048', 'https://www.elloumi.com', 'Electrical', '500+', 'Electrical manufacturing', 'Tunis', 'contact@elloumi.com'),
('00000000-0000-0000-0001-000000000049', 'https://www.elmouradi.com', 'Hotels', '500+', 'Hotel chain', 'Tunis', 'contact@elmouradi.com'),
('00000000-0000-0000-0001-000000000050', 'https://www.karthago.com', 'Tourism', '500+', 'Tourism & aviation', 'Tunis', 'contact@karthago.com'),
('00000000-0000-0000-0001-000000000051', 'https://www.delice.com', 'Agro-food', '500+', 'Dairy products', 'Tunis', 'contact@delice.com'),
('00000000-0000-0000-0001-000000000052', 'https://www.onetech.com', 'Electronics', '500+', 'Electronics manufacturing', 'Tunis', 'contact@onetech.com'),
('00000000-0000-0000-0001-000000000053', 'https://www.telnet.com', 'IT', '500+', 'IT services & offshore', 'Tunis', 'contact@telnet.com'),
('00000000-0000-0000-0001-000000000054', 'https://www.stb.com', 'Banking', '500+', 'Banking services', 'Tunis', 'contact@stb.com'),
('00000000-0000-0000-0001-000000000055', 'https://www.tunisair.com', 'Airline', '1000+', 'National airline', 'Tunis', 'contact@tunisair.com'),
('00000000-0000-0000-0001-000000000056', 'https://www.tunisre.com', 'Insurance', '500+', 'Reinsurance company', 'Tunis', 'contact@tunisre.com');

-- Insert job offers (1 per company = 56 offers)
INSERT INTO job_offers (company_id, title, description, location, salary_min, salary_max, skills, requirements, is_active) VALUES
-- AI Companies
('00000000-0000-0000-0001-000000000001', 'Machine Learning Engineer Intern', 'Work on cutting-edge AI projects with our research team. Build and deploy ML models for enterprise clients.', 'Tunis', 2000, 3000, ARRAY['Python', 'TensorFlow', 'PyTorch', 'ML'], ARRAY['CS/ML background', 'Python proficiency', 'Strong math skills'], true),
('00000000-0000-0000-0001-000000000009', 'AI Research Intern', 'Join our AI lab to develop innovative solutions for food industry digitalization.', 'Tunis', 1500, 2500, ARRAY['Python', 'Deep Learning', 'NLP'], ARRAY['AI/ML coursework', 'Research experience'], true),

-- Fintech
('00000000-0000-0000-0001-000000000002', 'Mobile Developer Intern', 'Develop features for Flouci mobile payment app used by millions of Tunisians.', 'Tunis', 1800, 2800, ARRAY['React Native', 'JavaScript', 'Mobile Dev'], ARRAY['Mobile development experience', 'CS degree'], true),
('00000000-0000-0000-0001-000000000020', 'Backend Developer Intern', 'Build scalable financial systems and APIs for banking solutions.', 'Tunis', 1800, 2600, ARRAY['Node.js', 'PostgreSQL', 'REST APIs'], ARRAY['Backend experience', 'Database knowledge'], true),

-- HealthTech
('00000000-0000-0000-0001-000000000005', 'Full Stack Developer Intern', 'Build mental health platform features connecting patients with therapists.', 'Tunis', 1500, 2300, ARRAY['React', 'Node.js', 'MongoDB'], ARRAY['Full stack experience', 'Empathy for users'], true),
('00000000-0000-0000-0001-000000000010', 'UX Designer Intern', 'Design intuitive healthcare interfaces for teleconsultation platform.', 'Tunis', 1600, 2400, ARRAY['Figma', 'UX Research', 'Prototyping'], ARRAY['Design portfolio', 'Healthcare interest'], true),
('00000000-0000-0000-0001-000000000012', 'Mobile Developer Intern', 'Develop medical apps for healthcare professionals.', 'Tunis', 1500, 2200, ARRAY['Flutter', 'Dart', 'Mobile Dev'], ARRAY['Mobile experience', 'Healthcare passion'], true),

-- Cleantech / IoT
('00000000-0000-0000-0001-000000000003', 'IoT Engineer Intern', 'Work on atmospheric water generation systems. Build IoT solutions for water collection.', 'Sousse', 1700, 2500, ARRAY['IoT', 'Embedded C', 'Arduino', 'Sensors'], ARRAY['Electronics background', 'Sustainability passion'], true),
('00000000-0000-0000-0001-000000000015', 'Hardware Engineer Intern', 'Design environmental monitoring systems.', 'Tunis', 1600, 2400, ARRAY['PCB Design', 'Embedded Systems', 'IoT'], ARRAY['EE degree', 'Hands-on experience'], true),

-- Big Data
('00000000-0000-0000-0001-000000000004', 'Data Scientist Intern', 'Analyze large datasets and build predictive models for business intelligence.', 'Tunis', 1900, 2800, ARRAY['Python', 'SQL', 'Spark', 'ML'], ARRAY['Statistics background', 'Data analysis skills'], true),

-- ERP
('00000000-0000-0000-0001-000000000006', 'Software Developer Intern', 'Develop ERP modules for Tunisian businesses. Work with enterprise software.', 'Tunis', 1600, 2400, ARRAY['Java', 'SQL', 'ERP Systems'], ARRAY['Java proficiency', 'Business understanding'], true),

-- Productivity / Web
('00000000-0000-0000-0001-000000000007', 'Frontend Developer Intern', 'Build beautiful UIs for productivity applications.', 'Tunis', 1500, 2300, ARRAY['React', 'TypeScript', 'CSS'], ARRAY['Frontend experience', 'Eye for design'], true),
('00000000-0000-0000-0001-000000000011', 'Full Stack Developer Intern', 'Build web and mobile applications for clients.', 'Tunis', 1700, 2600, ARRAY['React', 'Node.js', 'PostgreSQL'], ARRAY['Full stack skills', 'Portfolio'], true),
('00000000-0000-0000-0001-000000000032', 'Web Developer Intern', 'Create modern web applications for diverse clients.', 'Tunis', 1500, 2300, ARRAY['HTML', 'CSS', 'JavaScript', 'React'], ARRAY['Web development skills', 'Portfolio'], true),

-- FMCG / Logistics
('00000000-0000-0000-0001-000000000008', 'DevOps Engineer Intern', 'Manage infrastructure for high-traffic B2B marketplace.', 'Tunis', 1800, 2700, ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD'], ARRAY['Linux knowledge', 'Cloud experience'], true),
('00000000-0000-0000-0001-000000000014', 'Operations Analyst Intern', 'Optimize logistics operations using data analytics.', 'Tunis', 1500, 2200, ARRAY['Excel', 'SQL', 'Data Analysis'], ARRAY['Analytical skills', 'Operations interest'], true),

-- IT / DevOps
('00000000-0000-0000-0001-000000000016', 'Cloud Engineer Intern', 'Build and maintain cloud infrastructure for clients.', 'Tunis', 1800, 2700, ARRAY['AWS', 'Azure', 'Terraform', 'Linux'], ARRAY['Cloud certifications helpful', 'Linux skills'], true),
('00000000-0000-0000-0001-000000000053', 'Software Engineer Intern', 'Join TELNET offshore team building solutions for European clients.', 'Tunis', 2000, 3000, ARRAY['Java', 'Spring Boot', 'Microservices'], ARRAY['Strong programming skills', 'English fluency'], true),

-- Smart Cities
('00000000-0000-0000-0001-000000000013', 'IoT Developer Intern', 'Build smart city solutions for urban infrastructure.', 'Tunis', 1600, 2400, ARRAY['IoT', 'Python', 'Data Analytics'], ARRAY['IoT experience', 'City planning interest'], true),

-- Agriculture
('00000000-0000-0000-0001-000000000017', 'AgriTech Developer Intern', 'Build technology solutions for modern farming.', 'Tunis', 1400, 2100, ARRAY['Python', 'IoT', 'Mobile Dev'], ARRAY['Tech skills', 'Agriculture interest'], true),

-- EdTech
('00000000-0000-0000-0001-000000000018', 'Content Developer Intern', 'Create engaging educational content for online platform.', 'Tunis', 1400, 2000, ARRAY['Content Creation', 'LMS', 'Video Editing'], ARRAY['Education background', 'Content skills'], true),
('00000000-0000-0000-0001-000000000037', 'Product Manager Intern', 'Shape the future of education technology products.', 'Tunis', 1600, 2400, ARRAY['Product Management', 'Agile', 'UX'], ARRAY['PM interest', 'Education passion'], true),

-- Energy
('00000000-0000-0000-0001-000000000019', 'Energy Analyst Intern', 'Analyze energy data and support renewable projects.', 'Tunis', 1500, 2200, ARRAY['Data Analysis', 'Excel', 'Energy Systems'], ARRAY['Engineering background', 'Sustainability focus'], true),

-- Food
('00000000-0000-0000-0001-000000000021', 'Operations Intern', 'Support food technology operations and supply chain.', 'Tunis', 1300, 1900, ARRAY['Operations', 'Supply Chain', 'Data Entry'], ARRAY['Operations interest', 'Detail oriented'], true),

-- HR Tech
('00000000-0000-0000-0001-000000000022', 'HR Tech Developer Intern', 'Build HR management platform features.', 'Tunis', 1500, 2200, ARRAY['React', 'Node.js', 'HR Systems'], ARRAY['Web development', 'HR interest'], true),

-- Insurance
('00000000-0000-0000-0001-000000000023', 'Actuary Intern', 'Support actuarial analysis and risk modeling.', 'Tunis', 1700, 2500, ARRAY['Statistics', 'Excel', 'Risk Modeling'], ARRAY['Math/Stats degree', 'Analytical mind'], true),
('00000000-0000-0000-0001-000000000056', 'Underwriting Intern', 'Learn reinsurance underwriting at Tunisia RE.', 'Tunis', 1600, 2300, ARRAY['Risk Analysis', 'Finance', 'Insurance'], ARRAY['Finance background', 'Detail oriented'], true),

-- Legal Tech
('00000000-0000-0000-0001-000000000024', 'Legal Tech Developer Intern', 'Build legal document automation tools.', 'Tunis', 1500, 2200, ARRAY['Python', 'NLP', 'Document Processing'], ARRAY['Programming skills', 'Legal interest'], true),

-- Marketing
('00000000-0000-0000-0001-000000000025', 'Digital Marketing Intern', 'Support digital marketing campaigns and analytics.', 'Tunis', 1300, 1900, ARRAY['Social Media', 'Google Analytics', 'Content'], ARRAY['Marketing coursework', 'Creative mind'], true),

-- Media
('00000000-0000-0000-0001-000000000026', 'Content Producer Intern', 'Create multimedia content for digital platforms.', 'Tunis', 1300, 1900, ARRAY['Video Editing', 'Content Creation', 'Social Media'], ARRAY['Portfolio required', 'Creative skills'], true),
('00000000-0000-0000-0001-000000000034', 'Video Editor Intern', 'Edit videos for marketing and entertainment.', 'Tunis', 1400, 2000, ARRAY['Premiere Pro', 'After Effects', 'Motion Graphics'], ARRAY['Video portfolio', 'Creative eye'], true),

-- Mobile
('00000000-0000-0000-0001-000000000027', 'Android Developer Intern', 'Build native Android applications.', 'Tunis', 1600, 2400, ARRAY['Kotlin', 'Android SDK', 'Firebase'], ARRAY['Android experience', 'Published apps helpful'], true),

-- Security
('00000000-0000-0000-0001-000000000028', 'Security Analyst Intern', 'Support cybersecurity operations and threat analysis.', 'Tunis', 1700, 2500, ARRAY['Security', 'Network Analysis', 'SIEM'], ARRAY['Security certifications helpful', 'Curious mind'], true),

-- Software
('00000000-0000-0000-0001-000000000029', 'QA Engineer Intern', 'Test software applications and ensure quality.', 'Tunis', 1400, 2100, ARRAY['Testing', 'Selenium', 'JIRA'], ARRAY['QA methodologies', 'Detail oriented'], true),

-- Telecom
('00000000-0000-0000-0001-000000000030', 'Network Engineer Intern', 'Support telecommunications infrastructure.', 'Tunis', 1600, 2400, ARRAY['Networking', 'Cisco', 'Telecom'], ARRAY['Networking knowledge', 'Telecom interest'], true),

-- Travel
('00000000-0000-0000-0001-000000000031', 'Travel Tech Developer Intern', 'Build travel booking and management features.', 'Tunis', 1500, 2200, ARRAY['React', 'Node.js', 'APIs'], ARRAY['Web development', 'Travel enthusiasm'], true),

-- Design
('00000000-0000-0000-0001-000000000033', 'Graphic Designer Intern', 'Create visual designs for clients across industries.', 'Tunis', 1400, 2000, ARRAY['Photoshop', 'Illustrator', 'Figma'], ARRAY['Design portfolio', 'Creative vision'], true),

-- Fashion
('00000000-0000-0000-0001-000000000035', 'Fashion Marketing Intern', 'Support fashion brand marketing initiatives.', 'Tunis', 1300, 1800, ARRAY['Marketing', 'Social Media', 'Fashion'], ARRAY['Fashion interest', 'Marketing skills'], true),

-- Sport
('00000000-0000-0000-0001-000000000036', 'Sports Tech Intern', 'Build sports analytics and fan engagement tools.', 'Tunis', 1400, 2100, ARRAY['Data Analysis', 'Mobile Dev', 'Sports'], ARRAY['Sports passion', 'Tech skills'], true),

-- Engineering
('00000000-0000-0000-0001-000000000038', 'Mechanical Engineer Intern', 'Support engineering projects and design work.', 'Tunis', 1600, 2400, ARRAY['CAD', 'SolidWorks', 'Engineering'], ARRAY['ME degree', 'CAD proficiency'], true),

-- Architecture
('00000000-0000-0000-0001-000000000039', 'Architecture Intern', 'Assist in architectural design and planning.', 'Tunis', 1500, 2200, ARRAY['AutoCAD', 'SketchUp', 'Architecture'], ARRAY['Architecture student', 'Portfolio'], true),

-- Construction
('00000000-0000-0000-0001-000000000040', 'Civil Engineer Intern', 'Support construction project management.', 'Tunis', 1600, 2400, ARRAY['Civil Engineering', 'Project Management'], ARRAY['CE degree', 'Site experience helpful'], true),

-- Real Estate
('00000000-0000-0000-0001-000000000041', 'Real Estate Analyst Intern', 'Support property valuation and market analysis.', 'Tunis', 1500, 2200, ARRAY['Excel', 'Financial Analysis', 'Real Estate'], ARRAY['Finance background', 'Real estate interest'], true),
('00000000-0000-0000-0001-000000000042', 'Property Manager Intern', 'Learn property management operations.', 'Tunis', 1400, 2000, ARRAY['Property Management', 'Customer Service'], ARRAY['Business degree', 'People skills'], true),

-- Industrial / Chemical
('00000000-0000-0000-0001-000000000043', 'Chemical Engineer Intern', 'Support industrial chemical processes at GCT.', 'Tunis', 1700, 2500, ARRAY['Chemical Engineering', 'Process Design'], ARRAY['ChemE degree', 'Lab experience'], true),

-- Agro-food
('00000000-0000-0000-0001-000000000044', 'Quality Control Intern', 'Ensure food safety and quality standards at SFBT.', 'Tunis', 1500, 2200, ARRAY['Food Science', 'Quality Control', 'Lab Skills'], ARRAY['Food science background', 'Lab experience'], true),
('00000000-0000-0000-0001-000000000045', 'Production Engineer Intern', 'Support food production at Groupe Poulina.', 'Tunis', 1600, 2400, ARRAY['Food Engineering', 'Production', 'Quality'], ARRAY['Engineering degree', 'Food industry interest'], true),
('00000000-0000-0000-0001-000000000046', 'Supply Chain Intern', 'Optimize supply chain at Groupe Mabrouk.', 'Tunis', 1500, 2200, ARRAY['Supply Chain', 'Logistics', 'Excel'], ARRAY['Business degree', 'Analytical skills'], true),
('00000000-0000-0000-0001-000000000051', 'Marketing Intern', 'Support dairy product marketing at Délice.', 'Tunis', 1400, 2000, ARRAY['Marketing', 'Consumer Goods', 'Social Media'], ARRAY['Marketing student', 'Creative mind'], true),

-- Tourism / Hotels
('00000000-0000-0000-0001-000000000047', 'Tourism Operations Intern', 'Support tourism operations at Groupe TTS.', 'Tunis', 1400, 2000, ARRAY['Tourism', 'Customer Service', 'Languages'], ARRAY['Tourism student', 'Language skills'], true),
('00000000-0000-0000-0001-000000000049', 'Hotel Management Intern', 'Learn hotel operations at El Mouradi chain.', 'Tunis', 1400, 2000, ARRAY['Hospitality', 'Customer Service', 'Management'], ARRAY['Hospitality degree', 'Service mindset'], true),
('00000000-0000-0000-0001-000000000050', 'Aviation Intern', 'Support aviation operations at Karthago Airlines.', 'Tunis', 1500, 2200, ARRAY['Aviation', 'Operations', 'Customer Service'], ARRAY['Aviation interest', 'Flexibility'], true),

-- Electronics / Manufacturing
('00000000-0000-0000-0001-000000000048', 'Electrical Engineer Intern', 'Support electrical manufacturing at Elloumi.', 'Tunis', 1600, 2400, ARRAY['Electrical Engineering', 'PCB', 'Testing'], ARRAY['EE degree', 'Hands-on skills'], true),
('00000000-0000-0000-0001-000000000052', 'Electronics Technician Intern', 'Support electronics manufacturing at One Tech.', 'Tunis', 1500, 2200, ARRAY['Electronics', 'Testing', 'Quality'], ARRAY['Electronics background', 'Technical skills'], true),

-- Banking
('00000000-0000-0000-0001-000000000054', 'Banking Operations Intern', 'Learn banking operations at STB.', 'Tunis', 1600, 2300, ARRAY['Banking', 'Finance', 'Customer Service'], ARRAY['Finance degree', 'Detail oriented'], true),

-- Airline
('00000000-0000-0000-0001-000000000055', 'Airline Operations Intern', 'Support flight operations at TunisAir.', 'Tunis', 1700, 2500, ARRAY['Aviation', 'Operations', 'Logistics'], ARRAY['Aviation background', 'Flexibility'], true);

-- Success message
SELECT 'Seed data inserted: 56 companies and 56 job offers!' as status;
