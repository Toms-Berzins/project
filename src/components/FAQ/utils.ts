export const highlightText = (text: string, query: string): string => {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map(part => 
    part.toLowerCase() === query.toLowerCase() 
      ? `<mark class="bg-orange-200/20 text-orange-400 px-1 rounded">${part}</mark>`
      : part
  ).join('');
}; 