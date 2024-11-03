import { NextResponse } from 'next/server';
import { supabase } from '../../../supabaseClient';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Fetch user from Supabase
        const { data: user, error } = await supabase
            .from('Users')
            .select('Email, Password, isAdmin')  
            .ilike('Email', email) 
            .single();

        if(user) console.log("Data: ", user)

        if (error || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        if (user.Password !== password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Check if the user is an organization or employee
        if (user.isAdmin) {
            return NextResponse.json({ message: "Sign-in successful, redirecting to organization dashboard", dashboard: 'organization' }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Sign-in successful, redirecting to employee dashboard", dashboard: 'employee' }, { status: 200 });
        }

    } catch (error) {
        console.error("Error during sign-in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
