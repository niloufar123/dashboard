import Link from "next/link";

export default function Customers() {

    return (
        <div>
            <p>
                <p>Customers Page</p>


                <Link href="/blog">Blog</Link>
                <p>
                    <a href="/contact">Contact</a>

                </p>
                {/* No prefetching */}
            </p>
        </div>
    )
}