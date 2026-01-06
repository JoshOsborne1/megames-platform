// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MegamesApp",
    platforms: [.iOS(.v16)],
    dependencies: [
        .package(url: "https://github.com/supabase/supabase-swift.git", from: "2.0.0")
    ],
    targets: [
        .target(
            name: "MegamesApp",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift")
            ]
        )
    ]
)
