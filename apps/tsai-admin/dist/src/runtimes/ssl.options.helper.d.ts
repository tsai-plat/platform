declare const loadSslOptions: () => {
    key: Buffer<ArrayBufferLike>;
    cert: Buffer<ArrayBufferLike>;
};
export default loadSslOptions;
