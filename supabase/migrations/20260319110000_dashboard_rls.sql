-- Adicionando políticas de segurança permissivas para visualização geral (Dashboard)
-- O Dashboard precisa ler pedidos, pacientes, procedimentos e perfis de forma segura e rápida

-- Garantir acesso a pedidos de cirurgia (somente leitura)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pedidos_cirurgia' AND policyname = 'pedidos_select_dashboard'
    ) THEN
        CREATE POLICY "pedidos_select_dashboard" ON public.pedidos_cirurgia
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Garantir acesso a pacientes (somente leitura)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'patients_select_dashboard'
    ) THEN
        CREATE POLICY "patients_select_dashboard" ON public.patients
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Garantir acesso a procedimentos (somente leitura)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'procedures' AND policyname = 'procedures_select_dashboard'
    ) THEN
        CREATE POLICY "procedures_select_dashboard" ON public.procedures
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Garantir acesso a perfis para visualização de nomes no dashboard (somente leitura)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_dashboard'
    ) THEN
        CREATE POLICY "profiles_select_dashboard" ON public.profiles
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;
