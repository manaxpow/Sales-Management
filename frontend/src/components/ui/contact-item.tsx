import React from "react";

type Props = {
  href: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
};

const ContactItem: React.FC<Props> = ({ href, label, Icon }) => (
  <div className="flex items-center mr-6">
    <div className="w-5 h-5 mr-2 text-gray-600"><Icon className="w-full h-full" /></div>
    <div className="text-sm">
      <a href={href} className="hover:underline text-gray-700">{label}</a>
    </div>
  </div>
);

export default ContactItem;
