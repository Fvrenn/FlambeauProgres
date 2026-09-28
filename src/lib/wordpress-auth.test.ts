import { describe, it, expect, vi, beforeEach } from "vitest";

const cookiesCourants = vi.hoisted(() => ({
  valeur: [] as { name: string; value: string }[],
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => cookiesCourants.valeur }),
}));

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

vi.mock("@/services/wp-progression.service", () => ({
  WpProgressionService: {},
}));

import {
  fetchWpProgression,
  getSessionWp,
  oublierSessionWp,
} from "@/lib/wordpress-auth";

const reponseWp = (id: number) =>
  ({ ok: true, json: async () => ({ id, progression: [] }) }) as Response;

const fetchSimule = vi.fn();

function connecter(session: string) {
  cookiesCourants.valeur = [
    { name: "wordpress_logged_in_abc", value: session },
  ];
}

beforeEach(() => {
  fetchSimule.mockReset();
  vi.stubGlobal("fetch", fetchSimule);
});

describe("getSessionWp", () => {
  it("n'interroge WordPress qu'une fois pour deux lectures rapprochées", async () => {
    connecter("session-1");
    fetchSimule.mockResolvedValue(reponseWp(1));

    await getSessionWp();
    const seconde = await getSessionWp();

    expect(seconde?.id).toBe(1);
    expect(fetchSimule).toHaveBeenCalledTimes(1);
  });

  it("garde une entrée séparée par session", async () => {
    connecter("session-2");
    fetchSimule.mockResolvedValue(reponseWp(2));
    await getSessionWp();

    connecter("session-3");
    fetchSimule.mockResolvedValue(reponseWp(3));

    expect((await getSessionWp())?.id).toBe(3);
    expect(fetchSimule).toHaveBeenCalledTimes(2);
  });

  it("ne mémorise pas une réponse en échec", async () => {
    connecter("session-4");
    fetchSimule.mockResolvedValueOnce({ ok: false } as Response);
    fetchSimule.mockResolvedValueOnce(reponseWp(4));

    expect(await getSessionWp()).toBeNull();
    expect((await getSessionWp())?.id).toBe(4);
  });

  it("relit WordPress après avoir oublié la session", async () => {
    connecter("session-5");
    fetchSimule.mockResolvedValue(reponseWp(5));
    await getSessionWp();

    await oublierSessionWp();
    await getSessionWp();

    expect(fetchSimule).toHaveBeenCalledTimes(2);
  });

  it("ne fait aucun appel sans cookie de session WordPress", async () => {
    cookiesCourants.valeur = [];

    expect(await getSessionWp()).toBeNull();
    expect(fetchSimule).not.toHaveBeenCalled();
  });
});

describe("fetchWpProgression", () => {
  it("lit toujours WordPress en direct, même quand la session est en cache", async () => {
    connecter("session-6");
    fetchSimule.mockResolvedValue(reponseWp(6));
    await getSessionWp();

    await fetchWpProgression();

    expect(fetchSimule).toHaveBeenCalledTimes(2);
  });
});
