export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // แทนที่ช่องว่างด้วย -
    .replace(/[^a-z0-9-]/g, '') // ลบอักขระพิเศษ
    .replace(/-+/g, '-') // รวม - ซ้ำ ๆ ให้เหลือตัวเดียว
    .replace(/^-+|-+$/g, ''); // ลบ - ที่อยู่หน้าหรือท้าย
};
