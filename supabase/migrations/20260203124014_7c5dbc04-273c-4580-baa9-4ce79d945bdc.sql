-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'Starter',
  status TEXT NOT NULL DEFAULT 'Pending',
  users INTEGER NOT NULL DEFAULT 0,
  conversations TEXT NOT NULL DEFAULT '0',
  mrr TEXT NOT NULL DEFAULT '$0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_plans table
CREATE TABLE public.billing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket_messages table
CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  sender_type TEXT NOT NULL DEFAULT 'client',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for clients (super_admin and admin can access)
CREATE POLICY "Admins can view all clients" ON public.clients
  FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clients" ON public.clients
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clients" ON public.clients
  FOR UPDATE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- RLS policies for billing_plans (super_admin and admin can access)
CREATE POLICY "Admins can view all plans" ON public.billing_plans
  FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert plans" ON public.billing_plans
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plans" ON public.billing_plans
  FOR UPDATE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plans" ON public.billing_plans
  FOR DELETE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- RLS policies for support_tickets (super_admin and admin can access)
CREATE POLICY "Admins can view all tickets" ON public.support_tickets
  FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tickets" ON public.support_tickets
  FOR UPDATE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tickets" ON public.support_tickets
  FOR DELETE USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- RLS policies for ticket_messages
CREATE POLICY "Admins can view all messages" ON public.ticket_messages
  FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert messages" ON public.ticket_messages
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_plans_updated_at
  BEFORE UPDATE ON public.billing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default billing plans
INSERT INTO public.billing_plans (name, price, description, is_popular) VALUES
  ('Starter', '$299/mo', ARRAY['Up to 10 users', '5,000 conversations/mo', 'Basic analytics', 'Email support'], false),
  ('Professional', '$599/mo', ARRAY['Up to 50 users', '25,000 conversations/mo', 'Advanced analytics', 'Priority support', 'Custom integrations'], true),
  ('Enterprise', '$1,299/mo', ARRAY['Unlimited users', 'Unlimited conversations', 'White-label options', 'Dedicated support', 'SLA guarantee', 'Custom AI training'], false);