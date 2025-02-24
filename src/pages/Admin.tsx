import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Users } from 'lucide-react';
import type { Admin as AdminType } from '../types';
import { readJsonFile, writeJsonFile } from '../services/dataService';
import toast from 'react-hot-toast';

export function Admin() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [newAdmin, setNewAdmin] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      const data = await readJsonFile<{
        admins: AdminType[];
      }>('admin.json');
      
      setAdmins(data?.admins || []);
    };
    loadAdminData();
  }, []);

  const handleAddAdmin = async () => {
    if (newAdmin) {
      const updatedAdmins = [...admins, { username: newAdmin }];
      const success = await writeJsonFile('admin.json', {
        admins: updatedAdmins,
        settings: { taskReward: 10000, supportReward: 5000 }
      });

      if (success) {
        setAdmins(updatedAdmins);
        setNewAdmin('');
      }
    }
  };

  const handleRemoveAdmin = async (username: string) => {
    const updatedAdmins = admins.filter(admin => admin.username !== username);
    const success = await writeJsonFile('admin.json', {
      admins: updatedAdmins,
      settings: { taskReward: 10000, supportReward: 5000 }
    });

    if (success) {
      setAdmins(updatedAdmins);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter admin username"
            />
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </div>
          <div className="divide-y">
            {admins.map((admin) => (
              <div key={admin.username} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{admin.username}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600"
                  onClick={() => handleRemoveAdmin(admin.username)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
