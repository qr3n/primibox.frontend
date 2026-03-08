import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: true
});

export default withPWA({
    reactStrictMode: false,
})
