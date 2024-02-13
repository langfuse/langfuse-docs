import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import data from './pages/docs/_meta.json'

export function middleware(req: NextRequest) {
    if (req.nextUrl.searchParams.get('sidebarVisible') === 'false') {
        let fileData = JSON.stringify(data);
        console.log(fileData);
    };
}