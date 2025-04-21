export const extractFilenameFromHeaders = (headers) => {
    const disposition = headers['content-disposition'];
    if (!disposition) return null;
    
    const utf8FilenameRegex = /filename\*=UTF-8''([\w%.-]+(?:%20[\w%.-]*)*)/i;
    const asciiFilenameRegex = /filename=(["']?)(.*?[^\\])\1(;|$)/i;
    
    let filename = null;
    if (utf8FilenameRegex.test(disposition)) {
        filename = decodeURIComponent(utf8FilenameRegex.exec(disposition)[1]);
    } else {
        const matches = asciiFilenameRegex.exec(disposition);
        if (matches != null && matches[2]) {
            filename = matches[2];
        }
    }
    
    return filename;
}