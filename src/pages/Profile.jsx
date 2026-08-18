import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
export default function Profile() {
    const { user, refresh } = useAuth();
    const [form, setForm] = useState({
        name: user?.name ?? '',
        phone: user?.phone ?? '',
        license_number: user?.license_number ?? '',
    });
    const [pw, setPw] = useState({ current_password: '', new_password: '' });
    const [busy, setBusy] = useState(false);
    if (!user)
        return null;
    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api('/api/auth/profile', { method: 'PUT', body: form });
            await refresh();
            toast.success('Profile updated');
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Update failed');
        }
        finally {
            setBusy(false);
        }
    };
    const changePassword = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api('/api/auth/profile', { method: 'PUT', body: pw });
            setPw({ current_password: '', new_password: '' });
            toast.success('Password changed');
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Password change failed');
        }
        finally {
            setBusy(false);
        }
    };
    return (<div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>{user.email} · <span className="capitalize">{user.role}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label>Full name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}/>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}/>
            </div>
            <div>
              <Label>Driving licence number</Label>
              <Input value={form.license_number} onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}/>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={busy}>Save changes</Button>
          </form>

          <Separator className="my-6"/>

          <form onSubmit={changePassword} className="space-y-4">
            <h3 className="font-semibold text-slate-900">Change password</h3>
            <div>
              <Label>Current password</Label>
              <Input type="password" value={pw.current_password} onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))} required/>
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" minLength={6} value={pw.new_password} onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))} required/>
            </div>
            <Button variant="outline" disabled={busy}>Change password</Button>
          </form>
        </CardContent>
      </Card>
    </div>);
}
