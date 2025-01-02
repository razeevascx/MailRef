import { MailIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {};
export default function Mailref({}: Props) {
    return (
        <div className='inline-flex items-center space-x-2'>
            <Link href="/" className="flex items-center space-x-2">
                <MailIcon size={24} />
                <h1 className="text-2xl font-bold">
                    Mail <span className="text-blue-500">Ref</span>
                </h1>
            </Link>
        </div>
    );
}
