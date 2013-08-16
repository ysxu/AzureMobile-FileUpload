// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

namespace $namespace.DataModel
{
    using System.Runtime.Serialization;

    public class Picture
    {
        public int Id { get; set; }

        [DataMember(Name = "albumid")]
        public int AlbumId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "thumbnailurl")]
        public string ThumbnailUrl { get; set; }

        [DataMember(Name = "thumbnailFileName")]
        public string ThumbnailFileName { get; set; }

        [DataMember(Name = "imageurl")]
        public string ImageUrl { get; set; }

        [DataMember(Name = "fileName")]
        public string FileName { get; set; }
    }
}
