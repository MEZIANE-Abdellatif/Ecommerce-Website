import React from 'react';

const CLOUDINARY_UPLOAD_MARKER = '/upload/';

function transformCloudinaryUrl(src, width) {
  if (!src || typeof src !== 'string' || !src.includes('res.cloudinary.com') || !src.includes(CLOUDINARY_UPLOAD_MARKER)) {
    return src;
  }

  const [baseUrl, queryString] = src.split('?');
  const markerIndex = baseUrl.indexOf(CLOUDINARY_UPLOAD_MARKER);
  const uploadPrefix = baseUrl.slice(0, markerIndex + CLOUDINARY_UPLOAD_MARKER.length);
  const uploadSuffix = baseUrl.slice(markerIndex + CLOUDINARY_UPLOAD_MARKER.length);

  if (!uploadSuffix) {
    return src;
  }

  const segments = uploadSuffix.split('/');
  const firstSegment = segments[0] || '';

  const requestedWidth = Number(width);
  const hasValidWidth = Number.isFinite(requestedWidth) && requestedWidth > 0;

  const mergeTransforms = (existing) => {
    const transforms = existing ? existing.split(',').filter(Boolean) : [];
    const withoutWidth = transforms.filter((token) => !token.startsWith('w_'));

    if (!withoutWidth.includes('f_auto')) {
      withoutWidth.push('f_auto');
    }
    if (!withoutWidth.includes('q_auto')) {
      withoutWidth.push('q_auto');
    }
    if (hasValidWidth) {
      withoutWidth.push(`w_${requestedWidth}`);
    }

    return withoutWidth.join(',');
  };

  const startsWithVersion = /^v\d+$/.test(firstSegment);
  let transformedUrl;

  if (!startsWithVersion && firstSegment) {
    segments[0] = mergeTransforms(firstSegment);
    transformedUrl = `${uploadPrefix}${segments.join('/')}`;
  } else {
    const transformSegment = mergeTransforms('');
    transformedUrl = `${uploadPrefix}${transformSegment}/${uploadSuffix}`;
  }

  return queryString ? `${transformedUrl}?${queryString}` : transformedUrl;
}

export default function CloudinaryImage({ src, alt, width, ...imgProps }) {
  const transformedSrc = transformCloudinaryUrl(src, width);
  return <img src={transformedSrc} alt={alt} {...imgProps} />;
}
