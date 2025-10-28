import { NextRequest, NextResponse } from 'next/server';

// Mock file system data - in production, this would come from the user's actual file system
const mockFileSystem = {
  'user-1': {
    'C:\\Users\\John': {
      'Documents': {
        'Work': {
          'project1.txt': { type: 'file', size: 1024, modified: '2024-01-20T10:30:00Z' },
          'project2.docx': { type: 'file', size: 2048, modified: '2024-01-19T15:45:00Z' },
          'notes.pdf': { type: 'file', size: 5120, modified: '2024-01-18T09:20:00Z' }
        },
        'Personal': {
          'resume.pdf': { type: 'file', size: 1536, modified: '2024-01-15T14:30:00Z' },
          'photos': {
            'vacation.jpg': { type: 'file', size: 3072, modified: '2024-01-10T11:15:00Z' },
            'family.png': { type: 'file', size: 2048, modified: '2024-01-08T16:20:00Z' }
          }
        }
      },
      'Desktop': {
        'Yoom.lnk': { type: 'file', size: 256, modified: '2024-01-20T12:00:00Z' },
        'Important Files': {
          'contract.pdf': { type: 'file', size: 8192, modified: '2024-01-17T13:45:00Z' },
          'presentation.pptx': { type: 'file', size: 12288, modified: '2024-01-16T10:30:00Z' }
        }
      },
      'Downloads': {
        'Yoom-Setup.exe': { type: 'file', size: 51200, modified: '2024-01-20T13:00:00Z' },
        'software.zip': { type: 'file', size: 102400, modified: '2024-01-19T09:30:00Z' }
      }
    }
  },
  'user-2': {
    'C:\\Users\\Jane': {
      'Documents': {
        'Projects': {
          'web-app': {
            'index.html': { type: 'file', size: 512, modified: '2024-01-20T14:00:00Z' },
            'style.css': { type: 'file', size: 768, modified: '2024-01-20T13:45:00Z' },
            'script.js': { type: 'file', size: 1024, modified: '2024-01-20T13:30:00Z' }
          }
        }
      },
      'Desktop': {
        'Code': {
          'python': {
            'app.py': { type: 'file', size: 2048, modified: '2024-01-19T16:20:00Z' },
            'requirements.txt': { type: 'file', size: 256, modified: '2024-01-19T16:15:00Z' }
          }
        }
      }
    }
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const filePath = searchParams.get('path') || '';

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Get user's file system data
    const userFileSystem = mockFileSystem[userId as keyof typeof mockFileSystem];
    
    if (!userFileSystem) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse the requested path
    const pathParts = filePath.split('/').filter(part => part.length > 0);
    
    let currentLocation = userFileSystem;
    let currentPath = '';
    
    // Navigate to the requested path
    for (const part of pathParts) {
      if (currentLocation && typeof currentLocation === 'object' && part in currentLocation) {
        currentLocation = (currentLocation as any)[part];
        currentPath += (currentPath ? '/' : '') + part;
      } else {
        return NextResponse.json({ error: 'Path not found' }, { status: 404 });
      }
    }

    // Get contents of current location
    const contents = Object.entries(currentLocation).map(([name, item]) => ({
      name,
      type: item.type,
      size: item.size,
      modified: item.modified,
      path: currentPath + (currentPath ? '/' : '') + name
    }));

    return NextResponse.json({
      path: currentPath || '/',
      contents,
      user: userId
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to access file system' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, filePath, content } = body;

    switch (action) {
      case 'download_file':
        // In production, this would stream the actual file content
        return NextResponse.json({
          success: true,
          message: 'File download initiated',
          filePath,
          content: content || 'Mock file content for ' + filePath
        });

      case 'delete_file':
        // In production, this would actually delete the file
        return NextResponse.json({
          success: true,
          message: 'File deleted successfully',
          filePath
        });

      case 'create_folder':
        // In production, this would actually create the folder
        return NextResponse.json({
          success: true,
          message: 'Folder created successfully',
          filePath
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to perform file operation' }, { status: 500 });
  }
}
