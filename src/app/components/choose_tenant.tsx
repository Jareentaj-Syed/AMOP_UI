// pages/choose_tenant.tsx
import React from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { Footer } from './footer-nested';

const ChooseTenant: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="w-[300px] h-[55px] mb-1">
                <Image
                    src="/amop_logo_header.png"
                    alt="AMOP Core Logo"
                    layout="responsive"
                    width={300}
                    height={55}
                />
            </div>
            <h1 className="text-[28px] text-[#00C1F1] font-medium mb-2">Choose Partner</h1>
            <div className="space-y-[1px] flex flex-col mb-2">
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'
                    }}
                >
                    Altaworx-GT
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    AWX
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    AWX-AWX
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    AWX Test
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    CSV RS AG
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    Go Tech - AWX Test
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    GT
                </Button>
                <Button
                    className="rounded-full"
                    style={{
                        width: '150px',
                        height: '35px',
                        borderColor: '#00C1F1',
                        color: '#00C1F1'

                    }}
                >
                    Test Theme
                </Button>
            </div>
            <Footer />

        </div>
    );
};

export default ChooseTenant;
