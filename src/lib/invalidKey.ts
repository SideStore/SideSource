import { IRequest } from "itty-router";

export default function invalidKey(req: IRequest, env: any) {
    if (!req.params || !req.params["key"] || req.params["key"].length < 1) return new Response("no key found", { status: 500 });
    if (req.params["key"] != env.KEY) return new Response("wrong key", { status: 500 });
    return null;
}
