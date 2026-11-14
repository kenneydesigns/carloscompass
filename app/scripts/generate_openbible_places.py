"""Generate draft place YAML files for Carlo's Compass from the OpenBible.info
Bible Geocoding Data (CC BY 4.0) plus a few hand-cited Wikipedia coordinates.

Usage:  python3 -I tools/generate_places.py <path-to-Bible-Geocoding-Data> <out-dir>

Coordinates for OpenBible places are read from the dataset at run time (never
typed by hand). Each file's header records which OpenBible identification was
used and its confidence score (time_total, out of 1000), so a reviewer can trace
every pin. Verse references were written by hand and are the part to proof-read.
"""
import json
import os
import sys

HEADER = "# Draft by Claude (overnight session), 2026-11-14. Not yet reviewed by a person.\n"
OB_SUFFIX = "(OpenBible.info Bible Geocoding Data, CC BY 4.0)"


def ob_url(kind, rid, slug):
    return f"https://www.openbible.info/geo/{kind}/{rid}/{slug}"


# --------------------------------------------------------------------------
# Place definitions.
# coord: ("ancient", record_id, identification_index) -> read from OpenBible
#        ("modern", record_id)                          -> read from OpenBible
#        ("manual", lat, lng, note)                      -> cited by hand
# --------------------------------------------------------------------------

LIFE = "Life of Jesus"
EXODUS = "Exodus"

PLACES = [
    # ---------------- Life of Jesus ----------------
    dict(id="cana", name="Cana", collection=LIFE, region="Galilee",
         coord=("ancient", "a031bda", 0), certainty="probable",
         note="OpenBible's leading identification is Khirbet Qana (Horbat Qana). "
              "The Catholic pilgrimage church is at Kafr Kanna (OpenBible score 80/1000); not used here.",
         events=[
             ("The wedding at Cana: water made wine, Jesus' first sign", 28, ["John 2:1-11"]),
             ("At Cana, Jesus heals the royal official's son lying ill at Capernaum", 28, ["John 4:46-54"]),
         ]),
    dict(id="jordan-baptism", name="Bethany beyond the Jordan (baptism site)", collection=LIFE, region="Jordan Valley",
         coord=("ancient", "a6e060d", 0), certainty="probable",
         note="Al-Maghtas, the traditional baptism site. OpenBible score is only 320/1000 for this "
              "identification of 'Bethany beyond the Jordan' (John 1:28); marked probable as a traditional site.",
         events=[
             ("The baptism of Jesus in the Jordan", 28, ["Matthew 3:13-17", "Mark 1:9-11", "Luke 3:21-22"]),
             ("John the Baptist: \"Behold, the Lamb of God\"", 28, ["John 1:28-34"]),
             ("Andrew and another disciple follow Jesus; Simon is named Cephas", 28, ["John 1:35-42"]),
         ]),
    dict(id="jerusalem-temple", name="The Temple, Jerusalem", collection=LIFE, region="Jerusalem",
         coord=("manual", 31.77806, 35.23583,
                "Temple Mount, coordinates from the Wikipedia 'Temple Mount' infobox (31°46'41\"N 35°14'9\"E) "
                "as reported by web search through mirrors; the live page could not be opened from this session. "
                "Cross-reference: GeoNames 11258705."),
         certainty="confirmed",
         sources_extra=[("encyclopedia", "Temple Mount (Wikipedia)", "https://en.wikipedia.org/wiki/Temple_Mount"),
                        ("gazetteer", "Temple Mount (GeoNames)", "https://www.geonames.org/11258705")],
         events=[
             ("The Presentation of Jesus in the Temple; Simeon and Anna", -5, ["Luke 2:22-38"]),
             ("The boy Jesus found in the Temple", 8, ["Luke 2:41-52"]),
             ("Jesus drives out the money-changers (John's account, first Passover)", 28, ["John 2:13-22"]),
             ("Jesus teaches in Solomon's portico at the Feast of Dedication", 29, ["John 10:22-39"]),
             ("Jesus drives out the money-changers (Holy Week)", 30, ["Matthew 21:12-13", "Mark 11:15-17", "Luke 19:45-46"]),
             ("The widow's offering", 30, ["Mark 12:41-44", "Luke 21:1-4"]),
         ]),
    dict(id="upper-room", name="The Upper Room (Cenacle)", collection=LIFE, region="Jerusalem",
         coord=("manual", 31.7718, 35.2290,
                "Cenacle on Mount Zion, coordinates from the Wikipedia 'Cenacle' infobox (31°46'18\"N 35°13'44\"E) "
                "as reported by web search through mirrors; the live page could not be opened from this session. "
                "Scripture does not name the house; the Mount Zion tradition is attested from the 4th century "
                "and the present room is Crusader-era, hence 'uncertain'."),
         certainty="uncertain",
         sources_extra=[("encyclopedia", "Cenacle (Wikipedia)", "https://en.wikipedia.org/wiki/Cenacle")],
         events=[
             ("The Last Supper: Jesus institutes the Eucharist", 30,
              ["Matthew 26:17-30", "Mark 14:12-26", "Luke 22:7-20", "1 Corinthians 11:23-26"]),
             ("Jesus washes the disciples' feet", 30, ["John 13:1-17"]),
             ("The apostles gather in the upper room with Mary, the mother of Jesus", 30, ["Acts 1:12-14"]),
             ("Pentecost: the Holy Spirit descends (traditionally in the same place)", 30, ["Acts 2:1-4"]),
         ]),
    dict(id="gethsemane", name="Gethsemane", collection=LIFE, region="Jerusalem",
         coord=("ancient", "a42418f", 0), certainty="probable",
         note="Garden at the foot of the Mount of Olives; the precise spot (Church of All Nations) is traditional.",
         events=[
             ("The agony in the garden", 30, ["Matthew 26:36-46", "Mark 14:32-42", "Luke 22:39-46"]),
             ("The arrest of Jesus", 30, ["Matthew 26:47-56", "Mark 14:43-52", "Luke 22:47-53", "John 18:1-12"]),
         ]),
    dict(id="golgotha", name="Golgotha (Calvary) and the tomb", collection=LIFE, region="Jerusalem",
         coord=("ancient", "a631d35", 0), certainty="probable",
         note="Church of the Holy Sepulchre (OpenBible 426/1000; Gordon's Calvary scores below zero).",
         events=[
             ("The Crucifixion", 30, ["Matthew 27:33-56", "Mark 15:22-41", "Luke 23:33-49", "John 19:17-37"]),
             ("The burial of Jesus in a nearby garden tomb", 30, ["Matthew 27:57-61", "Mark 15:42-47", "Luke 23:50-56", "John 19:38-42"]),
             ("The Resurrection: the empty tomb", 30, ["Matthew 28:1-10", "Mark 16:1-8", "Luke 24:1-12", "John 20:1-18"]),
         ]),
    dict(id="mount-of-olives", name="Mount of Olives", collection=LIFE, region="Jerusalem",
         coord=("ancient", "ac2c4c5", 0), certainty="confirmed",
         note="Point for the ridge as a whole; Bethphage (Et-Tur, OpenBible 698/1000) is on its summit and is folded in here.",
         events=[
             ("Entry into Jerusalem, setting out from Bethphage on the Mount of Olives", 30,
              ["Matthew 21:1-11", "Mark 11:1-11", "Luke 19:28-40", "John 12:12-15"]),
             ("Jesus weeps over Jerusalem", 30, ["Luke 19:41-44"]),
             ("The discourse on the end of the age", 30, ["Matthew 24:3-25:46", "Mark 13:3-37"]),
             ("The Ascension", 30, ["Luke 24:50-51", "Acts 1:9-12"]),
         ]),
    dict(id="bethany", name="Bethany", collection=LIFE, region="Judea",
         coord=("ancient", "a4f35bc", 0), certainty="confirmed",
         note="Al-Eizariya (OpenBible 889/1000).",
         events=[
             ("Jesus raises Lazarus", 30, ["John 11:1-44"]),
             ("Jesus is anointed at Bethany", 30, ["Matthew 26:6-13", "Mark 14:3-9", "John 12:1-8"]),
             ("Jesus lodges at Bethany during his last week", 30, ["Matthew 21:17", "Mark 11:11-12"]),
         ]),
    dict(id="bethsaida", name="Bethsaida", collection=LIFE, region="Galilee",
         coord=("ancient", "a91b732", 0), certainty="uncertain",
         note="Et-Tell (OpenBible 466/1000) vs. el-Araj (172/1000); still actively disputed by excavators, hence 'uncertain'.",
         events=[
             ("Home town of Philip, Andrew and Peter", 28, ["John 1:44"]),
             ("Feeding of the five thousand, which Luke places near Bethsaida", 29, ["Luke 9:10-17"]),
             ("Jesus heals a blind man at Bethsaida", 29, ["Mark 8:22-26"]),
             ("\"Woe to you, Bethsaida\"", 29, ["Matthew 11:21", "Luke 10:13"]),
         ]),
    dict(id="tabgha", name="Tabgha", collection=LIFE, region="Galilee",
         coord=("modern", "mbbfbf9"), certainty="uncertain",
         note="OpenBible modern record (coordinates from Wikidata Q1026813). The link of these events to Tabgha is "
              "church tradition (Church of the Multiplication; Church of the Primacy of St Peter), not stated in "
              "Scripture; Luke 9:10 places the feeding near Bethsaida instead.",
         sources_extra=[("encyclopedia", "Church of the Primacy of Saint Peter (Wikipedia)",
                         "https://en.wikipedia.org/wiki/Church_of_the_Primacy_of_Saint_Peter")],
         events=[
             ("Feeding of the five thousand (traditional site)", 29, ["Matthew 14:13-21", "Mark 6:30-44", "John 6:1-14"]),
             ("The risen Jesus by the sea: \"Feed my sheep\" (traditional site)", 30, ["John 21:1-19"]),
         ]),
    dict(id="mount-tabor", name="Mount Tabor", collection=LIFE, region="Galilee",
         coord=("ancient", "acd63ee", 0), certainty="probable",
         note="The mountain itself is certain (Jebel et-Tur). The Gospels say only 'a high mountain'; Tabor is the "
              "traditional site of the Transfiguration (Mount Hermon is the main alternative proposal).",
         events=[
             ("The Transfiguration (traditional site)", 29, ["Matthew 17:1-9", "Mark 9:2-10", "Luke 9:28-36", "2 Peter 1:16-18"]),
         ]),
    dict(id="jericho", name="Jericho (New Testament city)", collection=LIFE, region="Judea",
         coord=("ancient", "aaf03fa", 0), certainty="confirmed",
         note="Herodian Jericho at Tulul Abu el-Alayiq (OpenBible 1000/1000), not the Old Testament tell.",
         events=[
             ("Jesus heals blind Bartimaeus", 30, ["Matthew 20:29-34", "Mark 10:46-52", "Luke 18:35-43"]),
             ("Zacchaeus", 30, ["Luke 19:1-10"]),
         ]),
    dict(id="jacobs-well", name="Jacob's Well (Sychar)", collection=LIFE, region="Samaria",
         coord=("manual", 32.209461, 35.285331,
                "Jacob's Well at Bir Ya'qub monastery, Nablus. Coordinates from the Wikipedia 'Jacob's Well' infobox "
                "as reported by web search (live page not opened); GeoNames 281302 gives 32.20952, 35.28518, which agrees. "
                "Sychar itself is identified with nearby Askar (OpenBible 620/1000)."),
         certainty="probable",
         sources_extra=[("encyclopedia", "Jacob's Well (Wikipedia)", "https://en.wikipedia.org/wiki/Jacob%27s_Well"),
                        ("gazetteer", "Bi'r Ya'qub (GeoNames)", "https://www.geonames.org/281302"),
                        ("dataset", "Sychar " + OB_SUFFIX, ob_url("ancient", "a27b472", "sychar"))],
         events=[
             ("Jesus and the Samaritan woman at the well", 28, ["John 4:4-42"]),
         ]),
    dict(id="emmaus", name="Emmaus", collection=LIFE, region="Judea",
         coord=("ancient", "ae7274b", 0), certainty="uncertain",
         note="One proposal of several: Qalunya/Motza (OpenBible 338/1000). Alternatives: Emmaus Nicopolis (240) and "
              "el-Qubeibeh (60, a Franciscan tradition).",
         events=[
             ("The road to Emmaus: Jesus made known in the breaking of the bread", 30, ["Luke 24:13-35"]),
         ]),
    dict(id="caesarea-philippi", name="Caesarea Philippi", collection=LIFE, region="Golan",
         coord=("ancient", "ab7bf48", 0), certainty="confirmed",
         note="Banias (OpenBible 1000/1000).",
         events=[
             ("Peter's confession: \"You are the Christ\"", 29, ["Matthew 16:13-20", "Mark 8:27-30"]),
         ]),
    dict(id="nain", name="Nain", collection=LIFE, region="Galilee",
         coord=("ancient", "aee679c", 0), certainty="confirmed",
         note="Nein (OpenBible 1000/1000).",
         events=[
             ("Jesus raises the widow's son", 28, ["Luke 7:11-17"]),
         ]),
    dict(id="magdala", name="Magdala", collection=LIFE, region="Galilee",
         coord=("ancient", "af75e9e", 0), certainty="probable",
         note="Majdal / Migdal (OpenBible 1000/1000 for the town). The link to Mary Magdalene rests on her name; "
              "Scripture does not name her town, hence 'probable'.",
         events=[
             ("Mary called Magdalene among the women who follow Jesus", 28, ["Luke 8:1-3"]),
         ]),
    dict(id="chorazin", name="Chorazin", collection=LIFE, region="Galilee",
         coord=("ancient", "a593a48", 0), certainty="probable",
         note="Khirbet Karraza (OpenBible 786/1000).",
         events=[
             ("\"Woe to you, Chorazin\"", 29, ["Matthew 11:20-24", "Luke 10:13-15"]),
         ]),
    dict(id="pool-of-bethesda", name="Pool of Bethesda", collection=LIFE, region="Jerusalem",
         coord=("ancient", "a0aa8cf", 0), certainty="confirmed",
         note="Excavated pools beside the Church of St Anne (OpenBible 1000/1000).",
         events=[
             ("Jesus heals the paralysed man at the pool", 29, ["John 5:1-15"]),
         ]),
    dict(id="pool-of-siloam", name="Pool of Siloam", collection=LIFE, region="Jerusalem",
         coord=("ancient", "a294859", 0), certainty="confirmed",
         note="OpenBible 1000/1000.",
         events=[
             ("Jesus heals the man born blind: \"Go, wash in the pool of Siloam\"", 29, ["John 9:1-12"]),
         ]),
    dict(id="gennesaret", name="Gennesaret", collection=LIFE, region="Galilee",
         coord=("ancient", "a7de69e", 0), certainty="probable",
         note="The plain of el-Ghuweir (OpenBible 1000/1000); a region, so the pin is a representative point.",
         events=[
             ("The sick are healed by touching the fringe of his garment", 29, ["Matthew 14:34-36", "Mark 6:53-56"]),
         ]),
    dict(id="kursi", name="Kursi (country of the Gerasenes)", collection=LIFE, region="Decapolis",
         coord=("modern", "m7767c8"), certainty="uncertain",
         note="The Gospels name the region differently (Gerasenes / Gadarenes); Kursi on the east shore is the "
              "traditional site of the event (OpenBible links it to 'Gergesa', a manuscript variant).",
         sources_extra=[("dataset", "Gerasa " + OB_SUFFIX, ob_url("ancient", "ada6b64", "gerasa"))],
         events=[
             ("Jesus heals the Gerasene demoniac", 29, ["Matthew 8:28-34", "Mark 5:1-20", "Luke 8:26-39"]),
         ]),
    dict(id="gabbatha", name="Gabbatha, the Stone Pavement", collection=LIFE, region="Jerusalem",
         coord=("ancient", "aec23b1", 0), certainty="uncertain",
         note="OpenBible's leading proposal: within 500 m of Herod's palace (605/1000). The Antonia-fortress "
              "tradition (Ecce Homo / Sisters of Zion) scores below zero.",
         events=[
             ("Jesus before Pilate", 30, ["Matthew 27:11-26", "Mark 15:1-15", "Luke 23:1-25", "John 18:28-19:16"]),
         ]),
    dict(id="tyre", name="Tyre", collection=LIFE, region="Phoenicia",
         coord=("ancient", "a160272", 0), certainty="confirmed",
         note="OpenBible 1000/1000 for the city; the event took place in 'the region of Tyre' (Mark 7:24).",
         events=[
             ("Jesus heals the Syrophoenician woman's daughter, in the region of Tyre", 29, ["Matthew 15:21-28", "Mark 7:24-30"]),
         ]),

    # ---------------- Exodus (early chronology, exodus c. 1446 BC per 1 Kings 6:1) ----------------
    dict(id="rameses", name="Rameses, in the land of Goshen", collection=EXODUS, region="Egypt",
         coord=("ancient", "a079b21", 0), certainty="probable",
         note="Qantir, site of Pi-Ramesses (OpenBible 509/1000; Tell el-Dab'a, adjacent, 270/1000).",
         sources_extra=[("dataset", "Goshen " + OB_SUFFIX, ob_url("ancient", "a60f092", "goshen-1"))],
         events=[
             ("Israel sets out from Rameses", -1446, ["Exodus 12:37", "Numbers 33:3-5"]),
         ]),
    dict(id="red-sea-crossing", name="The Red Sea crossing (one proposal: the Bitter Lakes)", collection=EXODUS, region="Egypt",
         coord=("ancient", "a3d18b2", 1), certainty="uncertain",
         note="One proposal among several. OpenBible ranks the Gulf of Suez first (369/1000) but only offers a "
              "mid-gulf representative point ~180 km south; the Bitter Lakes (304/1000) are shown instead. "
              "Lake Timsah (128/1000) and the Gulf of Aqaba are other proposals.",
         events=[
             ("Israel crosses the sea on dry ground", -1446, ["Exodus 14:1-31"]),
             ("The Song of Moses and Miriam", -1446, ["Exodus 15:1-21"]),
         ]),
    dict(id="marah", name="Marah", collection=EXODUS, region="Sinai",
         coord=("ancient", "ad3970d", 0), certainty="uncertain",
         note="Ain Hawarah (OpenBible 384/1000); depends on a southern Sinai route.",
         events=[
             ("The bitter water made sweet", -1446, ["Exodus 15:22-26", "Numbers 33:8"]),
         ]),
    dict(id="elim", name="Elim", collection=EXODUS, region="Sinai",
         coord=("ancient", "a2410c1", 0), certainty="uncertain",
         note="Along Wadi Gharandal (OpenBible 533/1000); depends on a southern Sinai route.",
         events=[
             ("Twelve springs and seventy palm trees", -1446, ["Exodus 15:27", "Numbers 33:9"]),
         ]),
    dict(id="wilderness-of-sin", name="Wilderness of Sin", collection=EXODUS, region="Sinai",
         coord=("ancient", "a0f54e4", 0), certainty="uncertain",
         note="Debbet er-Ramleh (OpenBible 311/1000); a region, pin is a representative point.",
         events=[
             ("Manna, bread from heaven, and the quail", -1446, ["Exodus 16:1-36", "Numbers 33:11", "John 6:31-35"]),
         ]),
    dict(id="rephidim", name="Rephidim", collection=EXODUS, region="Sinai",
         coord=("ancient", "a05ebb7", 0), certainty="uncertain",
         note="Along Wadi Rufaiyil (OpenBible 379/1000).",
         events=[
             ("Water from the rock at Massah and Meribah", -1446, ["Exodus 17:1-7"]),
             ("Victory over Amalek while Moses' hands are held up", -1446, ["Exodus 17:8-16"]),
         ]),
    dict(id="mount-sinai", name="Mount Sinai (traditional: Jebel Musa)", collection=EXODUS, region="Sinai",
         coord=("ancient", "abfba2a", 0), certainty="uncertain",
         note="Jebel Musa, the traditional site by St Catherine's Monastery (OpenBible 465/1000). "
              "Alternatives include Har Karkom (103) and Jebel Sin Bishar (89).",
         events=[
             ("The Ten Commandments given at Sinai", -1446, ["Exodus 19:1-20:17", "Deuteronomy 5:1-22"]),
             ("The covenant sealed: \"the blood of the covenant\"", -1446, ["Exodus 24:1-18"]),
             ("The golden calf, and the covenant renewed", -1446, ["Exodus 32:1-34:35"]),
         ]),
    dict(id="kadesh-barnea", name="Kadesh-barnea", collection=EXODUS, region="Negev",
         coord=("ancient", "ac2cef0", 0), certainty="probable",
         note="Ain el-Qudeirat (OpenBible 864/1000).",
         events=[
             ("The twelve spies return from Canaan; Israel refuses to enter", -1445, ["Numbers 13:1-14:45", "Deuteronomy 1:19-46"]),
             ("Miriam dies; water from the rock at Meribah", -1407, ["Numbers 20:1-13"]),
         ]),
    dict(id="mount-nebo", name="Mount Nebo", collection=EXODUS, region="Moab",
         coord=("ancient", "aefaa2d", 0), certainty="probable",
         note="Jabal al-Naba (OpenBible 413/1000). Ras Siyagha, site of the Franciscan Memorial of Moses, is "
              "~2.3 km west and scores 365/1000 (as Nebo) / 453 (as Pisgah).",
         sources_extra=[("dataset", "Pisgah " + OB_SUFFIX, ob_url("ancient", "afd9259", "pisgah"))],
         events=[
             ("Moses sees the Promised Land and dies in Moab", -1407, ["Deuteronomy 32:48-52", "Deuteronomy 34:1-8"]),
         ]),
]


def q(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def main(ob_dir, out_dir):
    anc = {}
    with open(os.path.join(ob_dir, "data", "ancient.jsonl")) as f:
        for line in f:
            r = json.loads(line)
            anc[r["id"]] = r
    mod = {}
    with open(os.path.join(ob_dir, "data", "modern.jsonl")) as f:
        for line in f:
            r = json.loads(line)
            mod[r["id"]] = r

    places_dir = os.path.join(out_dir, "packs", "bible-catholic", "places")
    os.makedirs(places_dir, exist_ok=True)
    report = []
    for p in PLACES:
        c = p["coord"]
        sources = []
        if c[0] == "ancient":
            r = anc[c[1]]
            ident = r["identifications"][c[2]]
            lng, lat = (float(x) for x in ident["resolutions"][0]["lonlat"].split(","))
            score = ident["score"]["time_total"]
            import re
            desc = re.sub("<[^>]+>", "", ident["description"])
            coord_note = (f"OpenBible ancient {r['id']} ('{r['friendly_id']}') -> identification #{c[2] + 1} "
                          f"'{desc}', confidence {score}/1000, {ident['resolutions'][0].get('lonlat_type')}.")
            sources.append(("dataset", f"{r['friendly_id']} {OB_SUFFIX}", ob_url("ancient", r["id"], r["url_slug"])))
        elif c[0] == "modern":
            r = mod[c[1]]
            lng, lat = (float(x) for x in r["lonlat"].split(","))
            cs = r.get("coordinates_source", {})
            coord_note = f"OpenBible modern {r['id']} ('{r['friendly_id']}'), coordinates via {cs.get('type')} {cs.get('id')}."
            sources.append(("dataset", f"{r['friendly_id']} {OB_SUFFIX}", ob_url("modern", r["id"], r["url_slug"])))
        else:
            lat, lng, coord_note = c[1], c[2], c[3]
        sources += p.get("sources_extra", [])

        lines = [HEADER.rstrip("\n")]
        lines.append(f"# Coordinates: {coord_note}")
        if p.get("note"):
            lines.append(f"# Certainty '{p['certainty']}': {p['note']}")
        lines.append("# Verse references written by hand from the Gospels/Torah; please proof-read.")
        lines.append(f"id: {p['id']}")
        lines.append(f"name: {q(p['name'])}")
        lines.append(f"category: {'gospel-place' if p['collection'] == LIFE else 'exodus-place'}")
        lines.append("location:")
        lines.append(f"  lat: {lat:.6f}".rstrip("0").rstrip("."))
        lines.append(f"  lng: {lng:.6f}".rstrip("0").rstrip("."))
        lines.append(f"  certainty: {p['certainty']}")
        lines.append("events:")
        for title, year, refs in p["events"]:
            lines.append(f"  - title: {q(title)}")
            lines.append(f"    date: {{ from: {year}, approx: true }}")
            lines.append("    scripture:")
            for ref in refs:
                lines.append(f"      - {ref.replace('-', '\u2013')}")
        lines.append("tags:")
        lines.append(f"  collection: [{q(p['collection'])}]")
        lines.append(f"  region: [{q(p['region'])}]")
        lines.append("sources:")
        for kind, title, url in sources:
            lines.append(f"  - kind: {kind}")
            lines.append(f"    title: {q(title)}")
            lines.append(f"    url: {q(url)}")
        with open(os.path.join(places_dir, p["id"] + ".yaml"), "w") as f:
            f.write("\n".join(lines) + "\n")
        report.append((p["collection"], p["id"], p["certainty"], lat, lng))

    for row in report:
        print(*row, sep="\t")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
