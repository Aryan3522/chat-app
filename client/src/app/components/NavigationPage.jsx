"use client";

import Link from "next/link";
import Button from "react-bootstrap/Button";

export default function NavigationPage() {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">

            <div
                className="bg-white p-5 rounded-4 shadow-lg text-center"
                style={{ width: "420px" }}
            >
                <h1 className="mb-4 text-dark">Welcome</h1>

                <div className="d-grid gap-3">

                    <Button
                        as={Link}
                        href="/pages/Auth"
                        variant="primary"
                        className="w-100"
                    >
                        Go to Auth
                    </Button>

                    <Button
                        as={Link}
                        href="/pages/Profile"
                        variant="primary"
                        className="w-100"
                    >
                        Go to Profile
                    </Button>

                </div>
            </div>

        </div>
    );
}