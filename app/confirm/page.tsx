type Props = {}
const page = (props: Props) => {
  return (
    <div>page</div>
  )
}
import React, { useState } from 'react';

const ConfirmPage = () => {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <div>
            <h1>{confirmed ? 'Confirmed!' : 'Please Confirm'}</h1>
            <button onClick={handleConfirm} disabled={confirmed}>
                {confirmed ? 'Confirmed' : 'Confirm'}
            </button>
        </div>
    );
};

export default ConfirmPage;
