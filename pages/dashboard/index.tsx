import React, { useState } from 'react'
import Nav from '../components/Nav'
import { Button } from '@/components/ui/button'
import DashboardLayout from './layout'
import Editor from '../components/Editor';

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    return (
        <DashboardLayout>
            <div>
                <Button className='absolute right-6 top-8' onClick={() => setOpen(true)}>Create a post</Button>
                {open && <Editor />}
            </div>
        </DashboardLayout>
    )
}

export default Dashboard
