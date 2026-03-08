/// <reference types="astro/client" />

interface RuntimeEnv {
  GITHUB_CLIENT_SECRET?: string;
}

interface CloudflareRuntime {
  env: RuntimeEnv;
}

declare namespace Astro {
  interface Locals {
    runtime: CloudflareRuntime;
  }
}
