import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div>
      <h1>COTAM</h1>
      <Link href="/listingCourses">Courses</Link>
    </div>
  );
}
