import React from 'react';

interface ContactUsProps {
    name: string;
}

const ContactUs = ({ name } : ContactUsProps) => {
    return <div>Coming soon. Contact us. {name}</div>
}

ContactUs.schema = {
    name: 'contact-us',
    props: {
        name: { type: 'string' },
    },
}

export default ContactUs;