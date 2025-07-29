// This API route is no longer needed with AppKit
// AppKit handles all authentication client-side
// 
// If you need API authentication, you can implement
// wallet signature verification here
//
// For example:
// - Verify wallet signatures
// - Check wallet ownership
// - Implement session management
//
// But for most dApps, AppKit's client-side auth is sufficient

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'This auth endpoint is no longer used. AppKit handles authentication client-side.'
    });
}

export async function POST() {
    return NextResponse.json({
        message: 'This auth endpoint is no longer used. AppKit handles authentication client-side.'
    });
}