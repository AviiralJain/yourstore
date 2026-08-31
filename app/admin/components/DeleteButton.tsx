"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ endpoint, id, itemName }: { endpoint: string, id: string, itemName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${itemName}?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('An error occurred during deletion');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleting}
      style={{ 
        color: '#ff4444', 
        background: 'none', 
        border: 'none', 
        fontWeight: 600, 
        cursor: deleting ? 'not-allowed' : 'pointer',
        opacity: deleting ? 0.5 : 1
      }}
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
